import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// 计算结果接口
interface CalculationResult {
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

export async function POST() {
  console.log('=== Calculate API Called ===')

  try {
    // 1. 从数据库获取所有工资数据
    const { data: salaries, error: salariesError } = await supabaseAdmin
      .from('salaries')
      .select('*')

    if (salariesError) {
      console.error('Failed to fetch salaries:', salariesError)
      return NextResponse.json({
        error: '获取工资数据失败',
        details: salariesError.message
      }, { status: 500 })
    }

    if (!salaries || salaries.length === 0) {
      return NextResponse.json({
        error: '没有工资数据，请先上传工资数据'
      }, { status: 400 })
    }

    console.log('Fetched', salaries.length, 'salary records')

    // 2. 从数据库获取所有城市标准
    const { data: cities, error: citiesError } = await supabaseAdmin
      .from('cities')
      .select('*')

    if (citiesError) {
      console.error('Failed to fetch cities:', citiesError)
      return NextResponse.json({
        error: '获取城市标准失败',
        details: citiesError.message
      }, { status: 500 })
    }

    if (!cities || cities.length === 0) {
      return NextResponse.json({
        error: '没有城市标准数据，请先上传城市标准'
      }, { status: 400 })
    }

    console.log('Fetched', cities.length, 'city standards')

    // 3. 按员工和城市分组计算平均工资
    const employeeGroups: { [key: string]: { salaries: number[], city: string, year: string } } = {}

    salaries.forEach(salary => {
      // 从月份中提取年份 (YYYYMM -> YYYY)
      const year = salary.month.substring(0, 4)
      const key = `${salary.employee_name}-${salary.city_name}-${year}`

      if (!employeeGroups[key]) {
        employeeGroups[key] = { salaries: [], city: salary.city_name, year }
      }
      employeeGroups[key].salaries.push(salary.salary_amount)
    })

    console.log('Grouped into', Object.keys(employeeGroups).length, 'employee-city-year combinations')

    // 4. 计算每位员工的社保费用
    const results: CalculationResult[] = []

    for (const [key, group] of Object.entries(employeeGroups)) {
      const [employee_name, city_name, year] = key.split('-')
      const avg_salary = group.salaries.reduce((sum, salary) => sum + salary, 0) / group.salaries.length

      // 获取对应城市的社保标准
      const cityStandard = cities.find(c =>
        c.city_name === city_name && c.year === year
      )

      if (!cityStandard) {
        console.warn(`No city standard found for ${city_name} in ${year}`)
        continue
      }

      // 确定缴费基数
      let contribution_base: number
      if (avg_salary < cityStandard.base_min) {
        contribution_base = cityStandard.base_min
      } else if (avg_salary > cityStandard.base_max) {
        contribution_base = cityStandard.base_max
      } else {
        contribution_base = avg_salary
      }

      // 计算公司缴纳金额（月缴费 × 12个月）
      const company_fee = contribution_base * cityStandard.rate * 12

      results.push({
        employee_name,
        city_name,
        year,
        avg_salary: parseFloat(avg_salary.toFixed(2)),
        contribution_base: parseFloat(contribution_base.toFixed(2)),
        company_fee: parseFloat(company_fee.toFixed(2))
      })
    }

    // 5. 将结果存储到数据库
    console.log('Inserting', results.length, 'calculation results to database...')
    const { error: insertError } = await supabaseAdmin.from('results').insert(results)

    if (insertError) {
      console.error('Failed to save results:', insertError)
      // 即使保存失败，也返回计算结果
    }

    // 6. 按城市汇总
    const cityTotals: { [key: string]: number } = {}
    let totalFee = 0

    results.forEach(result => {
      if (!cityTotals[result.city_name]) {
        cityTotals[result.city_name] = 0
      }
      cityTotals[result.city_name] += result.company_fee
      totalFee += result.company_fee
    })

    console.log('Calculation completed successfully')

    return NextResponse.json({
      message: '计算完成！',
      count: results.length,
      results,
      cityTotals,
      totalFee: parseFloat(totalFee.toFixed(2))
    })

  } catch (error: any) {
    console.error('Calculation error:', error)
    return NextResponse.json({
      error: '计算失败',
      details: error.message
    }, { status: 500 })
  }
}