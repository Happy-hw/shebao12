import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { mockResults } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const year = searchParams.get('year')

    let query = supabaseAdmin
      .from('results')
      .select('*')
      .order('created_at', { ascending: false })

    // 如果有城市筛选条件
    if (city) {
      query = query.eq('city_name', city)
    }

    // 如果有年份筛选条件
    if (year) {
      query = query.eq('year', year)
    }

    const { data: results, error } = await query

    if (error) {
      console.error('查询结果时出错:', error)
      // 如果是 API key 错误，返回模拟数据
      if (error.message.includes('Invalid API key')) {
        console.log('使用模拟数据模式')
        let filteredResults = mockResults

        // 应用筛选
        if (city) {
          filteredResults = filteredResults.filter(r => r.city_name === city)
        }
        if (year) {
          filteredResults = filteredResults.filter(r => r.year === year)
        }

        const totalFee = filteredResults.reduce((sum, result) => sum + result.company_fee, 0)

        return NextResponse.json({
          results: filteredResults,
          total: parseFloat(totalFee.toFixed(2)),
          count: filteredResults.length,
          mock: true
        })
      }
      return NextResponse.json(
        { error: '查询失败', details: error.message },
        { status: 500 }
      )
    }

    // 计算总金额
    const totalFee = results?.reduce((sum, result) => sum + result.company_fee, 0) || 0

    return NextResponse.json({
      results: results || [],
      total: parseFloat(totalFee.toFixed(2)),
      count: results?.length || 0
    })

  } catch (error: any) {
    console.error('获取结果时出错:', error)
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    )
  }
}