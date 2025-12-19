import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  console.log('=== Salaries Upload API Called ===')

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
    const salariesData = data.map((row: any) => {
      const salaryData = {
        employee_id: String(row.employee_id || row['员工工号'] || row['employee_id'] || ''),
        employee_name: String(row.employee_name || row['员工姓名'] || row['employee_name'] || ''),
        city_name: String(row.city_name || row['城市'] || row['city_name'] || ''),
        month: String(row.month || row['月份'] || row['month'] || ''),
        salary_amount: Number(row.salary_amount || row['工资金额'] || row['salary_amount'] || 0)
      }

      // 验证必填字段
      if (!salaryData.employee_name) {
        throw new Error(`第${data.indexOf(row) + 1}行：员工姓名不能为空`)
      }

      if (!salaryData.city_name) {
        throw new Error(`第${data.indexOf(row) + 1}行：城市名称不能为空`)
      }

      if (!salaryData.month) {
        throw new Error(`第${data.indexOf(row) + 1}行：月份不能为空`)
      }

      if (salaryData.salary_amount <= 0) {
        throw new Error(`第${data.indexOf(row) + 1}行：工资金额必须大于0`)
      }

      // 验证月份格式 (YYYYMM)
      if (!/^\d{6}$/.test(salaryData.month)) {
        throw new Error(`第${data.indexOf(row) + 1}行：月份格式错误，应为YYYYMM格式（如202401）`)
      }

      return salaryData
    })

    // 存储到数据库
    console.log('Inserting', salariesData.length, 'salary records to database...')
    const { error } = await supabaseAdmin.from('salaries').insert(salariesData)

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({
        error: '数据库存储失败',
        details: error.message
      }, { status: 500 })
    }

    console.log('Successfully inserted salaries data')

    return NextResponse.json({
      message: '工资数据上传成功！',
      count: salariesData.length,
      data: salariesData.slice(0, 3) // 返回前3条作为示例
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error.message || '上传失败',
      details: error.stack
    }, { status: 500 })
  }
}