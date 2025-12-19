import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  // 创建模板数据
  const templateData = [
    {
      city_name: '深圳',
      year: '2024',
      base_min: 2360,
      base_max: 27291,
      rate: 0.15
    },
    {
      city_name: '广州',
      year: '2024',
      base_min: 2300,
      base_max: 28868,
      rate: 0.15
    },
    {
      city_name: '佛山',
      year: '2024',
      base_min: 1900,
      base_max: 26421,
      rate: 0.15
    },
    {
      city_name: '东莞',
      year: '2024',
      base_min: 1900,
      base_max: 25874,
      rate: 0.14
    }
  ]

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(templateData)

  // 设置列宽
  ws['!cols'] = [
    { wch: 15 }, // city_name
    { wch: 10 }, // year
    { wch: 15 }, // base_min
    { wch: 15 }, // base_max
    { wch: 10 }  // rate
  ]

  XLSX.utils.book_append_sheet(wb, ws, '城市社保标准')

  // 生成Excel文件
  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  // 返回文件
  return new NextResponse(excelBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="cities_template.xlsx"'
    }
  })
}