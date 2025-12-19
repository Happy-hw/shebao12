import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== Test Upload API Called ===')

  try {
    // 检查formData
    const formData = await request.formData()
    console.log('FormData entries:', Array.from(formData.keys()))

    const file = formData.get('file') as File
    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    if (!file) {
      return NextResponse.json({
        error: 'No file received',
        formDataKeys: Array.from(formData.keys())
      }, { status: 400 })
    }

    // 读取文件内容以验证
    const buffer = await file.arrayBuffer()
    console.log('File buffer size:', buffer.byteLength)

    // 尝试动态导入xlsx
    try {
      console.log('Importing xlsx...')
      const xlsx = await import('xlsx')
      console.log('xlsx imported successfully')

      console.log('Reading workbook...')
      const workbook = xlsx.read(buffer, { type: 'array' })
      console.log('Workbook read:', {
        SheetNames: workbook.SheetNames,
        SheetCount: workbook.SheetNames.length
      })

      if (workbook.SheetNames.length === 0) {
        return NextResponse.json({ error: 'No sheets in workbook' }, { status: 400 })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(worksheet)

      console.log('Parsed data:', {
        rowCount: data.length,
        firstRow: data[0]
      })

      return NextResponse.json({
        success: true,
        message: 'File parsed successfully',
        fileName: file.name,
        fileSize: file.size,
        rowCount: data.length,
        firstRow: data[0],
        allData: data.slice(0, 3) // 返回前3行作为示例
      })

    } catch (xlsxError: any) {
      console.error('XLSX error:', xlsxError)
      return NextResponse.json({
        error: 'Failed to parse Excel',
        xlsxError: xlsxError.message,
        stack: xlsxError.stack
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Upload test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}