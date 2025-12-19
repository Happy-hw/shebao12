import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  console.log('=== Cities Upload API Called ===')

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    // 如果没有文件，返回错误提示
    if (!file) {
      return NextResponse.json({
        error: '请选择要上传的Excel文件'
      }, { status: 400 })
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'bytes')

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({
        error: '请上传Excel文件(.xlsx或.xls)'
      }, { status: 400 })
    }

    // 验证文件大小
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({
        error: '文件大小不能超过4MB'
      }, { status: 400 })
    }

    // 解析Excel文件
    const xlsx = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const workbook = xlsx.read(buffer, { type: 'array' })

    if (!workbook.SheetNames.length) {
      return NextResponse.json({
        error: 'Excel文件中没有工作表'
      }, { status: 400 })
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(worksheet)

    if (!data.length) {
      return NextResponse.json({
        error: 'Excel文件中没有数据'
      }, { status: 400 })
    }

    // 转换和验证数据
    const citiesData = data.map((row: any) => {
      const cityData = {
        city_name: String(row.city_name || row['城市名'] || row['city_name'] || ''),
        year: String(row.year || row['年份'] || row['year'] || '2024'),
        base_min: Number(row.base_min || row['基数下限'] || row['base_min'] || 0),
        base_max: Number(row.base_max || row['基数上限'] || row['base_max'] || 0),
        rate: Number(row.rate || row['缴纳比例'] || row['rate'] || 0)
      }

      // 验证必填字段
      if (!cityData.city_name) {
        throw new Error(`第${data.indexOf(row) + 1}行：城市名称不能为空`)
      }

      if (!cityData.year) {
        throw new Error(`第${data.indexOf(row) + 1}行：年份不能为空`)
      }

      if (cityData.base_min <= 0) {
        throw new Error(`第${data.indexOf(row) + 1}行：基数下限必须大于0`)
      }

      if (cityData.base_max <= 0) {
        throw new Error(`第${data.indexOf(row) + 1}行：基数上限必须大于0`)
      }

      if (cityData.rate < 0 || cityData.rate > 1) {
        throw new Error(`第${data.indexOf(row) + 1}行：缴纳比例必须在0-1之间`)
      }

      if (cityData.base_min > cityData.base_max) {
        throw new Error(`第${data.indexOf(row) + 1}行：基数下限不能大于基数上限`)
      }

      return cityData
    })

    // 存储到数据库
    console.log('Inserting', citiesData.length, 'cities to database...')
    const { error } = await supabaseAdmin.from('cities').insert(citiesData)

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({
        error: '数据库存储失败',
        details: error.message
      }, { status: 500 })
    }

    console.log('Successfully inserted cities data')

    return NextResponse.json({
      message: '城市数据上传成功！',
      count: citiesData.length,
      data: citiesData.slice(0, 3) // 返回前3条作为示例
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error.message || '上传失败',
      details: error.stack
    }, { status: 500 })
  }
}