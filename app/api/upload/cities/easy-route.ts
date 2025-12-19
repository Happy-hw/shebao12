import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Easy upload API called')

  try {
    // 直接返回成功，不做任何操作
    return NextResponse.json({
      message: '上传成功（简化版）',
      count: 4,
      mock: true,
      cities: [
        { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
        { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
        { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
        { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
      ]
    })
  } catch (error) {
    console.error('Easy upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}