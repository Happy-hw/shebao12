import { NextRequest, NextResponse } from 'next/server'
import { mockCities } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    console.log('简化城市上传API被调用')

    // 模拟处理
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      message: '城市数据已使用模拟数据加载',
      count: mockCities.length,
      mock: true,
      data: mockCities
    })
  } catch (error: any) {
    console.error('简化API错误:', error)
    return NextResponse.json(
      {
        error: '服务器错误',
        details: error.message || '未知错误'
      },
      { status: 500 }
    )
  }
}