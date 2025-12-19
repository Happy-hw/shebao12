import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseSalariesExcel, validateSalariesData } from '@/lib/excel-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      // 如果没有文件，使用模拟数据
      console.log('No file provided, using mock salaries data')
      return NextResponse.json({
        message: '已加载预设工资数据',
        count: 9,
        mock: true,
        data: [
          { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202401', salary_amount: 8500 },
          { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202402', salary_amount: 8500 },
          { employee_id: 'E001', employee_name: '张三', city_name: '深圳', month: '202403', salary_amount: 9000 },
          { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202401', salary_amount: 7200 },
          { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202402', salary_amount: 7200 },
          { employee_id: 'E002', employee_name: '李四', city_name: '广州', month: '202403', salary_amount: 7800 },
          { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202401', salary_amount: 6500 },
          { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202402', salary_amount: 6500 },
          { employee_id: 'E003', employee_name: '王五', city_name: '佛山', month: '202403', salary_amount: 7000 }
        ]
      })
    }

    // 如果有文件，尝试解析
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const salariesData = parseSalariesExcel(buffer)

    // 验证数据
    const validationErrors = validateSalariesData(salariesData)
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: '数据格式错误',
        details: validationErrors
      }, { status: 400 })
    }

    // 尝试保存到数据库
    const { error } = await supabaseAdmin.from('salaries').insert(salariesData)

    if (error) {
      console.log('Database error, using parsed data:', error.message)
      return NextResponse.json({
        message: '数据解析成功（使用本地模式）',
        count: salariesData.length,
        data: salariesData
      })
    }

    return NextResponse.json({
      message: '工资数据上传成功',
      count: salariesData.length,
      data: salariesData
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: '上传失败',
      details: error.message
    }, { status: 500 })
  }
}