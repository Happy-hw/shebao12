import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  console.log('=== Results API Called ===')

  try {
    // 从URL获取查询参数
    const url = new URL(request.url!)
    const city = url.searchParams.get('city')
    const year = url.searchParams.get('year')

    console.log('Query params:', { city, year })

    // 构建查询
    let query = supabaseAdmin.from('results').select('*').order('created_at', { ascending: false })

    // 添加筛选条件
    if (city) {
      query = query.eq('city_name', city)
    }
    if (year) {
      query = query.eq('year', year)
    }

    const { data: results, error } = await query

    if (error) {
      console.error('Failed to fetch results:', error)
      return NextResponse.json({
        error: '获取结果失败',
        details: error.message
      }, { status: 500 })
    }

    if (!results || results.length === 0) {
      return NextResponse.json({
        message: '暂无计算结果，请先上传数据并执行计算',
        results: [],
        count: 0,
        totalFee: 0
      })
    }

    // 计算汇总信息
    const totalCount = results.length
    const totalFee = results.reduce((sum, result) => sum + result.company_fee, 0)

    // 按城市分组统计
    const cityStats: { [key: string]: { count: number, total: number } } = {}
    results.forEach(result => {
      if (!cityStats[result.city_name]) {
        cityStats[result.city_name] = { count: 0, total: 0 }
      }
      cityStats[result.city_name].count += 1
      cityStats[result.city_name].total += result.company_fee
    })

    // 按年份分组统计
    const yearStats: { [key: string]: { count: number, total: number } } = {}
    results.forEach(result => {
      if (!yearStats[result.year]) {
        yearStats[result.year] = { count: 0, total: 0 }
      }
      yearStats[result.year].count += 1
      yearStats[result.year].total += result.company_fee
    })

    console.log('Fetched', totalCount, 'results')

    return NextResponse.json({
      results,
      count: totalCount,
      totalFee: parseFloat(totalFee.toFixed(2)),
      cityStats,
      yearStats
    })

  } catch (error: any) {
    console.error('Results API error:', error)
    return NextResponse.json({
      error: '获取结果失败',
      details: error.message
    }, { status: 500 })
  }
}