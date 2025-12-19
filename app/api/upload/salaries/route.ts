import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== Salaries Upload API Called ===')

  try {
    const formData = await request.formData()
    console.log('FormData entries:', Array.from(formData.keys()))

    const file = formData.get('file') as File
    console.log('File received:', file ? {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    } : 'No file')

    if (!file || file.size === 0) {
      console.log('No file provided or file is empty, using mock salaries data')
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

    console.log('Processing real file:', file.name)

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      console.log('Invalid file type:', file.name)
      return NextResponse.json({ error: '请上传Excel文件(.xlsx或.xls)' }, { status: 400 })
    }

    // 验证文件大小（Vercel限制4.5MB）
    if (file.size > 4 * 1024 * 1024) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: '文件大小不能超过4MB' }, { status: 400 })
    }

    // 尝试解析Excel文件
    let salariesData: any[] = []

    try {
      console.log('Importing xlsx module...')
      const xlsx = await import('xlsx')
      console.log('xlsx module imported successfully')

      console.log('Reading file buffer...')
      const buffer = await file.arrayBuffer()
      console.log('Buffer size:', buffer.byteLength)

      console.log('Reading workbook...')
      const workbook = xlsx.read(buffer, { type: 'array' })

      if (!workbook.SheetNames.length) {
        console.log('No sheets in workbook')
        return NextResponse.json({ error: 'Excel文件中没有工作表' }, { status: 400 })
      }

      const sheetName = workbook.SheetNames[0]
      console.log('Using sheet:', sheetName)
      const worksheet = workbook.Sheets[sheetName]

      console.log('Converting to JSON...')
      const data = xlsx.utils.sheet_to_json(worksheet)
      console.log('Raw data rows:', data.length)

      if (!data.length) {
        console.log('No data in worksheet')
        return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 })
      }

      console.log('Sample row:', data[0])

      // 转换数据
      salariesData = data.map((row: any, index: number) => {
        const salaryData = {
          employee_id: String(row.employee_id || row['员工工号'] || row['employee_id'] || row['ID'] || row['工号'] || ''),
          employee_name: String(row.employee_name || row['员工姓名'] || row['employee_name'] || row['Name'] || row['姓名'] || ''),
          city_name: String(row.city_name || row['城市'] || row['city_name'] || row['City'] || ''),
          month: String(row.month || row['月份'] || row['month'] || row['Month'] || ''),
          salary_amount: Number(row.salary_amount || row['工资金额'] || row['salary_amount'] || row['Salary'] || row['工资'] || 0)
        }

        // 验证必填字段
        if (!salaryData.employee_name || !salaryData.city_name || !salaryData.salary_amount || salaryData.salary_amount <= 0) {
          console.warn(`Missing required fields in row ${index}:`, {
            employee_name: salaryData.employee_name,
            city_name: salaryData.city_name,
            salary_amount: salaryData.salary_amount
          }, 'Original:', row)
          return null
        }

        return salaryData
      }).filter(Boolean)

      if (!salariesData.length) {
        console.log('No valid salary data after filtering')
        return NextResponse.json({
          error: '没有有效的工资数据。请确保Excel文件包含employee_name, city_name和salary_amount列。',
          sampleRow: data[0]
        }, { status: 400 })
      }

      console.log(`Successfully processed ${salariesData.length} salary records`)
      console.log('First salary:', salariesData[0])

    } catch (parseError: any) {
      console.error('Excel parsing error:', parseError)
      return NextResponse.json({
        error: 'Excel文件解析失败',
        details: parseError.message || '请确保文件格式正确'
      }, { status: 400 })
    }

    // 返回解析的数据
    return NextResponse.json({
      message: '工资数据解析成功！',
      count: salariesData.length,
      data: salariesData,
      parsed: true
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: '上传失败',
      details: error.message
    }, { status: 500 })
  }
}