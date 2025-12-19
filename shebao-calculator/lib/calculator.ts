import { supabaseAdmin } from './supabase'

// 计算结果接口
export interface CalculationResult {
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

// 计算年度月平均工资
async function calculateAverageSalary(): Promise<any[]> {
  const { data: salaries, error } = await supabaseAdmin
    .from('salaries')
    .select('employee_name, city_name, salary_amount, month')

  if (error) {
    throw new Error(`查询工资数据失败: ${error.message}`)
  }

  // 按员工和城市分组计算平均工资
  const employeeGroups: { [key: string]: { salaries: number[], city: string } } = {}

  salaries.forEach(salary => {
    const key = `${salary.employee_name}-${salary.city_name}`
    if (!employeeGroups[key]) {
      employeeGroups[key] = { salaries: [], city: salary.city_name }
    }
    employeeGroups[key].salaries.push(salary.salary_amount)
  })

  // 计算每位员工的平均工资
  const results = []
  for (const [key, group] of Object.entries(employeeGroups)) {
    const [employee_name, city_name] = key.split('-')
    const avg_salary = group.salaries.reduce((sum, salary) => sum + salary, 0) / group.salaries.length

    results.push({
      employee_name,
      city_name,
      avg_salary: parseFloat(avg_salary.toFixed(2))
    })
  }

  return results
}

// 获取城市社保标准
async function getCityStandard(cityName: string, year: string): Promise<any> {
  const { data: city, error } = await supabaseAdmin
    .from('cities')
    .select('*')
    .eq('city_name', cityName)
    .eq('year', year)
    .single()

  if (error) {
    throw new Error(`获取城市${cityName}年份${year}的社保标准失败: ${error.message}`)
  }

  return city
}

// 确定缴费基数
function determineContributionBase(avgSalary: number, baseMin: number, baseMax: number): number {
  if (avgSalary < baseMin) return baseMin
  if (avgSalary > baseMax) return baseMax
  return avgSalary
}

// 计算公司缴纳金额
function calculateCompanyFee(contributionBase: number, rate: number): number {
  return contributionBase * rate
}

// 主计算流程
export async function executeCalculation(): Promise<CalculationResult[]> {
  try {
    // 1. 获取所有员工的平均工资
    const employeeSalaries = await calculateAverageSalary()

    const results: CalculationResult[] = []

    // 2. 对每个员工进行计算
    for (const emp of employeeSalaries) {
      // 假设使用2023年的标准（可以根据实际需求调整）
      const year = '2023'

      // 3. 获取城市社保标准
      const cityStandard = await getCityStandard(emp.city_name, year)

      // 4. 确定缴费基数
      const contributionBase = determineContributionBase(
        emp.avg_salary,
        cityStandard.base_min,
        cityStandard.base_max
      )

      // 5. 计算公司缴纳金额
      const companyFee = calculateCompanyFee(contributionBase, cityStandard.rate)

      results.push({
        employee_name: emp.employee_name,
        city_name: emp.city_name,
        year,
        avg_salary: emp.avg_salary,
        contribution_base: contributionBase,
        company_fee: parseFloat(companyFee.toFixed(2))
      })
    }

    // 6. 保存计算结果到数据库
    const { error: insertError } = await supabaseAdmin
      .from('results')
      .insert(results)

    if (insertError) {
      throw new Error(`保存计算结果失败: ${insertError.message}`)
    }

    return results
  } catch (error) {
    console.error('计算过程中出错:', error)
    throw error
  }
}