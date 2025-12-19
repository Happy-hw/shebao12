import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseCitiesExcel, validateCitiesData } from '@/lib/excel-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      // 如果没有文件，使用模拟数据
      console.log('No file provided, using mock cities data')
      return NextResponse.json({
        message: '已加载预设城市数据',
        count: 4,
        mock: true,
        data: [
          { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
          { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
          { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
          { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
        ]
      })
    }

    // 如果有文件，尝试解析
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const citiesData = parseCitiesExcel(buffer)

    // 验证数据
    const validationErrors = validateCitiesData(citiesData)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: '数据格式错误',
        details: validationErrors
      }, { status: 400 })
    }

    // 尝试保存到数据库
    const { error } = await supabaseAdmin.from('cities').insert(citiesData)

    if (error) {
      console.log('Database error, using parsed data:', error.message)
      return NextResponse.json({
        message: '数据解析成功（使用本地模式）',
        count: citiesData.length,
        data: citiesData
      })
    }

    return NextResponse.json({
      message: '城市数据上传成功',
      count: citiesData.length,
      data: citiesData
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: '上传失败',
      details: error.message
    }, { status: 500 })
  }
}