import { NextResponse } from 'next/server'
import { executeCalculation } from '@/lib/calculator'
import { mockResults } from '@/lib/mock-data'

export async function POST() {
  try {
    // 执行计算流程
    const results = await executeCalculation()

    return NextResponse.json({
      message: '计算完成',
      count: results.length,
      results: results
    })

  } catch (error: any) {
    console.error('执行计算时出错:', error)
    // 如果是 API key 错误，返回模拟数据
    if (error.message.includes('Invalid API key')) {
      console.log('使用模拟数据模式')
      return NextResponse.json({
        message: '计算完成（模拟数据）',
        count: mockResults.length,
        results: mockResults,
        mock: true
      })
    }
    return NextResponse.json(
      { error: '计算失败', details: error.message },
      { status: 500 }
    )
  }
}