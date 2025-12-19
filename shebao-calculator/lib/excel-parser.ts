import * as xlsx from 'xlsx'

// 解析城市数据Excel文件
export function parseCitiesExcel(buffer: ArrayBuffer) {
  const workbook = xlsx.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(worksheet)

  return data.map((row: any) => ({
    city_name: row.city_name || row['城市名'],
    year: row.year || row['年份'],
    base_min: Number(row.base_min || row['基数下限']),
    base_max: Number(row.base_max || row['基数上限']),
    rate: Number(row.rate || row['缴纳比例'])
  }))
}

// 解析工资数据Excel文件
export function parseSalariesExcel(buffer: ArrayBuffer) {
  const workbook = xlsx.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(worksheet)

  return data.map((row: any) => ({
    employee_id: row.employee_id || row['员工工号'],
    employee_name: row.employee_name || row['员工姓名'],
    city_name: row.city_name || row['城市'],
    month: row.month || row['月份'],
    salary_amount: Number(row.salary_amount || row['工资金额'])
  }))
}

// 验证城市数据格式
export function validateCitiesData(data: any[]) {
  const errors: string[] = []

  data.forEach((item, index) => {
    if (!item.city_name) errors.push(`第${index + 1}行：城市名不能为空`)
    if (!item.year) errors.push(`第${index + 1}行：年份不能为空`)
    if (isNaN(item.base_min)) errors.push(`第${index + 1}行：基数下限必须是数字`)
    if (isNaN(item.base_max)) errors.push(`第${index + 1}行：基数上限必须是数字`)
    if (isNaN(item.rate)) errors.push(`第${index + 1}行：缴纳比例必须是数字`)
  })

  return errors
}

// 验证工资数据格式
export function validateSalariesData(data: any[]) {
  const errors: string[] = []

  data.forEach((item, index) => {
    if (!item.employee_id) errors.push(`第${index + 1}行：员工工号不能为空`)
    if (!item.employee_name) errors.push(`第${index + 1}行：员工姓名不能为空`)
    if (!item.city_name) errors.push(`第${index + 1}行：城市不能为空`)
    if (!item.month) errors.push(`第${index + 1}行：月份不能为空`)
    if (isNaN(item.salary_amount)) errors.push(`第${index + 1}行：工资金额必须是数字`)
  })

  return errors
}