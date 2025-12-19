import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('=== Cities Upload API Called ===')

  try {
    const formData = await request.formData()
    console.log('FormData entries:', Array.from(formData.keys()))

    const file = formData.get('file') as File
    console.log('File received:', file ? {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    } : 'No file')

    if (!file || file.size === 0) {
      console.log('No file provided or file is empty, using mock cities data')
      return NextResponse.json({
        message: '已加载预设城市数据',
        count: 4,
        mock: true,
        data: [
          { city_name: '深圳', year: '2024', base_min: 2360, base_max: 27291, rate: 0.15 },
          { city_name: '广州', year: '2024', base_min: 2300, base_max: 28868, rate: 0.15 },
          { city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
          { city_name: '东莞', year: '2024', base_min: 1900, base_max: 25874, rate: 0.14 }
        ]
      })
    }

    console.log('Processing real file:', file.name)

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      console.log('Invalid file type:', file.name)
      return NextResponse.json({ error: '请上传Excel文件(.xlsx或.xls)' }, { status: 400 })
    }

    // 验证文件大小（Vercel限制4.5MB）
    if (file.size > 4 * 1024 * 1024) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: '文件大小不能超过4MB' }, { status: 400 })
    }

    // 尝试解析Excel文件
    let citiesData: any[] = []

    try {
      console.log('Importing xlsx module...')
      const xlsx = await import('xlsx')
      console.log('xlsx module imported successfully')

      console.log('Reading file buffer...')
      const buffer = await file.arrayBuffer()
      console.log('Buffer size:', buffer.byteLength)

      console.log('Reading workbook...')
      const workbook = xlsx.read(buffer, { type: 'array' })

      if (!workbook.SheetNames.length) {
        console.log('No sheets in workbook')
        return NextResponse.json({ error: 'Excel文件中没有工作表' }, { status: 400 })
      }

      const sheetName = workbook.SheetNames[0]
      console.log('Using sheet:', sheetName)
      const worksheet = workbook.Sheets[sheetName]

      console.log('Converting to JSON...')
      const data = xlsx.utils.sheet_to_json(worksheet)
      console.log('Raw data rows:', data.length)

      if (!data.length) {
        console.log('No data in worksheet')
        return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 })
      }

      console.log('Sample row:', data[0])

      // 转换数据
      citiesData = data.map((row: any, index: number) => {
        const cityData = {
          city_name: row.city_name || row['城市名'] || row['city_name'] || row['City'] || row['城市'] || '',
          year: String(row.year || row['年份'] || row['year'] || row['Year'] || row['年'] || '2024'),
          base_min: Number(row.base_min || row['基数下限'] || row['base_min'] || row['Min'] || row['下限'] || 1900),
          base_max: Number(row.base_max || row['基数上限'] || row['base_max'] || row['Max'] || row['上限'] || 30000),
          rate: Number(row.rate || row['缴纳比例'] || row['rate'] || row['Rate'] || row['比例'] || 0.15)
        }

        // 验证必填字段
        if (!cityData.city_name) {
          console.warn(`Missing city_name in row ${index}:`, row)
          return null
        }

        return cityData
      }).filter(Boolean)

      if (!citiesData.length) {
        console.log('No valid city data after filtering')
        return NextResponse.json({
          error: '没有有效的城市数据。请确保Excel文件包含city_name列。',
          sampleRow: data[0]
        }, { status: 400 })
      }

      console.log(`Successfully processed ${citiesData.length} cities`)
      console.log('First city:', citiesData[0])

    } catch (parseError: any) {
      console.error('Excel parsing error:', parseError)
      return NextResponse.json({
        error: 'Excel文件解析失败',
        details: parseError.message || '请确保文件格式正确'
      }, { status: 400 })
    }

    // 返回解析的数据（不需要保存到数据库）
    return NextResponse.json({
      message: '城市数据解析成功！',
      count: citiesData.length,
      data: citiesData,
      parsed: true
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: '上传失败',
      details: error.message
    }, { status: 500 })
  }
}