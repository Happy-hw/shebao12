import { NextResponse } from 'next/server'

export async function GET() {
  console.log('测试API被调用')
  return NextResponse.json({
    message: '测试成功',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  console.log('测试POST API被调用')
  return NextResponse.json({
    message: '测试POST成功',
    timestamp: new Date().toISOString()
  })
}