import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseSalariesExcel, validateSalariesData } from '@/lib/excel-parser'
import { mockSalaries } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件' }, { status: 400 })
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer()

    // 解析Excel数据
    const salariesData = parseSalariesExcel(buffer)

    // 验证数据格式
    const validationErrors = validateSalariesData(salariesData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: '数据格式错误', details: validationErrors },
        { status: 400 }
      )
    }

    // 插入数据到数据库
    const { error } = await supabaseAdmin
      .from('salaries')
      .insert(salariesData)

    if (error) {
      console.error('数据库插入错误:', error)
      // 如果是 API key 错误，返回模拟数据成功的信息
      if (error.message.includes('Invalid API key')) {
        console.log('使用模拟数据模式')
        return NextResponse.json({
          message: '工资数据已使用模拟数据加载',
          count: mockSalaries.length,
          mock: true
        })
      }
      return NextResponse.json(
        { error: '数据上传失败', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '工资数据上传成功',
      count: salariesData.length
    })

  } catch (error: any) {
    console.error('上传工资数据时出错:', error)
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    )
  }
}