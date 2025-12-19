import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Easy salaries upload API called')

  try {
    // 直接返回成功，不做任何操作
    return NextResponse.json({
      message: '工资数据上传成功（简化版）',
      count: 9,
      mock: true,
      salaries: [
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
  } catch (error) {
    console.error('Easy salaries upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}