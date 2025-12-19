import { NextResponse } from 'next/server'

// 内存中存储的数据（用于演示）
let citiesData: any[] = [
  { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
  { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
  { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
  { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
]

let salariesData: any[] = [
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

// 更新数据的函数
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.cities) {
      citiesData = body.cities
    }

    if (body.salaries) {
      salariesData = body.salaries
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}

// 计算社保费用
export async function POST() {
  console.log('开始执行社保计算...')

  try {
    // 1. 按员工和城市分组计算平均工资
    const employeeGroups: { [key: string]: { salaries: number[], city: string } } = {}

    salariesData.forEach(salary => {
      const key = `${salary.employee_name}-${salary.city_name}`
      if (!employeeGroups[key]) {
        employeeGroups[key] = { salaries: [], city: salary.city_name }
      }
      employeeGroups[key].salaries.push(salary.salary_amount)
    })

    // 2. 计算每位员工的平均工资和社保费用
    const results = []

    for (const [key, group] of Object.entries(employeeGroups)) {
      const [employee_name, city_name] = key.split('-')
      const avg_salary = group.salaries.reduce((sum, salary) => sum + salary, 0) / group.salaries.length

      // 获取城市的社保标准（使用2024年）
      const cityStandard = citiesData.find(c =>
        c.city_name === city_name && c.year === '2024'
      )

      if (!cityStandard) {
        console.warn(`未找到${city_name}的社保标准`)
        continue
      }

      // 确定缴费基数
      const contribution_base = avg_salary < cityStandard.base_min
        ? cityStandard.base_min
        : avg_salary > cityStandard.base_max
        ? cityStandard.base_max
        : avg_salary

      // 计算公司缴纳金额（年缴费）
      const company_fee = contribution_base * cityStandard.rate * 12

      results.push({
        employee_name,
        city_name,
        year: '2024',
        avg_salary: parseFloat(avg_salary.toFixed(2)),
        contribution_base: parseFloat(contribution_base.toFixed(2)),
        company_fee: parseFloat(company_fee.toFixed(2))
      })
    }

    // 3. 按城市汇总
    const cityTotals: { [key: string]: number } = {}
    results.forEach(result => {
      if (!cityTotals[result.city_name]) {
        cityTotals[result.city_name] = 0
      }
      cityTotals[result.city_name] += result.company_fee
    })

    // 4. 计算总费用
    const totalFee = Object.values(cityTotals).reduce((sum, fee) => sum + fee, 0)

    console.log(`计算完成，共${results.length}条结果`)

    return NextResponse.json({
      message: '计算完成',
      count: results.length,
      results,
      cityTotals,
      totalFee: parseFloat(totalFee.toFixed(2)),
      mock: true
    })

  } catch (error: any) {
    console.error('计算错误:', error)
    return NextResponse.json(
      {
        error: '计算失败',
        details: error.message
      },
      { status: 500 }
    )
  }
}