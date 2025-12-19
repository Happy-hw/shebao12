import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Salaries upload API called')

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

    console.log('Received file:', file.name, file.size, 'bytes')

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件(.xlsx或.xls)' }, { status: 400 })
    }

    // 验证文件大小（Vercel限制4.5MB）
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过4MB' }, { status: 400 })
    }

    // 尝试解析Excel文件
    let salariesData: any[] = []

    try {
      const xlsx = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = xlsx.read(buffer, { type: 'array' })

      if (!workbook.SheetNames.length) {
        return NextResponse.json({ error: 'Excel文件中没有工作表' }, { status: 400 })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(worksheet)

      if (!data.length) {
        return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 })
      }

      console.log(`Parsed ${data.length} rows from Excel`)

      // 转换数据
      salariesData = data.map((row: any) => {
        const salaryData = {
          employee_id: row.employee_id || row['员工工号'] || row['employee_id'] || '',
          employee_name: row.employee_name || row['员工姓名'] || row['employee_name'] || '',
          city_name: row.city_name || row['城市'] || row['city_name'] || '',
          month: row.month || row['月份'] || row['month'] || '',
          salary_amount: Number(row.salary_amount || row['工资金额'] || row['salary_amount'] || 0)
        }

        // 验证必填字段
        if (!salaryData.employee_name || !salaryData.city_name || !salaryData.salary_amount) {
          console.warn('Missing required fields in row:', row)
          return null
        }

        return salaryData
      }).filter(Boolean)

      if (!salariesData.length) {
        return NextResponse.json({
          error: '没有有效的工资数据。请确保Excel文件包含employee_name, city_name和salary_amount列。'
        }, { status: 400 })
      }

      console.log(`Successfully processed ${salariesData.length} salary records`)

    } catch (parseError: any) {
      console.error('Excel parsing error:', parseError)
      return NextResponse.json({
        error: 'Excel文件解析失败',
        details: parseError.message || '请确保文件格式正确'
      }, { status: 400 })
    }

    // 尝试保存到数据库（如果可能）
    try {
      const { supabaseAdmin } = await import('@/lib/supabase')
      const { error } = await supabaseAdmin.from('salaries').insert(salariesData)

      if (!error) {
        return NextResponse.json({
          message: '工资数据上传并保存成功',
          count: salariesData.length,
          data: salariesData
        })
      }

      console.log('Database save failed, using parsed data:', error.message)
    } catch (dbError) {
      console.log('Database connection failed, using parsed data')
    }

    // 如果数据库保存失败，返回解析的数据
    return NextResponse.json({
      message: '工资数据解析成功（使用本地模式）',
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