import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  // 创建模板数据
  const templateData = [
    {
      employee_id: 'E001',
      employee_name: '张三',
      city_name: '深圳',
      month: '202401',
      salary_amount: 8500
    },
    {
      employee_id: 'E001',
      employee_name: '张三',
      city_name: '深圳',
      month: '202402',
      salary_amount: 8500
    },
    {
      employee_id: 'E001',
      employee_name: '张三',
      city_name: '深圳',
      month: '202403',
      salary_amount: 9000
    },
    {
      employee_id: 'E002',
      employee_name: '李四',
      city_name: '广州',
      month: '202401',
      salary_amount: 7200
    },
    {
      employee_id: 'E002',
      employee_name: '李四',
      city_name: '广州',
      month: '202402',
      salary_amount: 7200
    },
    {
      employee_id: 'E002',
      employee_name: '李四',
      city_name: '广州',
      month: '202403',
      salary_amount: 7800
    }
  ]

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(templateData)

  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // employee_id
    { wch: 15 }, // employee_name
    { wch: 15 }, // city_name
    { wch: 15 }, // month
    { wch: 15 }  // salary_amount
  ]

  XLSX.utils.book_append_sheet(wb, ws, '工资数据')

  // 生成Excel文件
  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  // 返回文件
  return new NextResponse(excelBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="salaries_template.xlsx"'
    }
  })
}