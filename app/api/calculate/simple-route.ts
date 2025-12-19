import { NextResponse } from 'next/server'
import { mockResults } from '@/lib/mock-data'

export async function POST() {
  console.log('Simple calculate API called')

  try {
    // 直接返回模拟计算结果
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟计算时间

    return NextResponse.json({
      message: '计算完成（简化版）',
      count: mockResults.length,
      results: mockResults,
      mock: true
    })
  } catch (error: any) {
    console.error('Simple calculate error:', error)
    return NextResponse.json(
      { error: '计算失败', details: error.message },
      { status: 500 }
    )
  }
}