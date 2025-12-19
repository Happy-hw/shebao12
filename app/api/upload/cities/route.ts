import { NextResponse } from 'next/server'

export async function POST() {
  console.log('Cities upload API called (simplified)')

  try {
    // 直接返回模拟数据
    return NextResponse.json({
      message: '城市数据上传成功（模拟数据）',
      count: 4,
      mock: true,
      cities: [
        { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
        { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
        { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
        { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
      ]
    })
  } catch (error: any) {
    console.error('Cities upload error:', error)
    return NextResponse.json(
      { error: '上传失败', details: error.message },
      { status: 500 }
    )
  }
}