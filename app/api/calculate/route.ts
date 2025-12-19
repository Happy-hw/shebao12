import { NextResponse } from 'next/server'
import { mockResults } from '@/lib/mock-data'

export async function POST() {
  console.log('Calculate API called (simplified)')

  try {
    // 直接返回模拟计算结果
    return NextResponse.json({
      message: '计算完成（模拟数据）',
      count: mockResults.length,
      results: mockResults,
      mock: true
    })
  } catch (error: any) {
    console.error('Calculate error:', error)
    return NextResponse.json(
      { error: '计算失败', details: error.message },
      { status: 500 }
    )
  }
}