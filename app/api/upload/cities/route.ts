import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Cities upload API called')

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      // 如果没有文件，使用模拟数据
      console.log('No file provided, using mock cities data')
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

    console.log('Received file:', file.name, file.size, 'bytes')

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件(.xlsx或.xls)' }, { status: 400 })
    }

    // 验证文件大小（Vercel限制4.5MB）
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过4MB' }, { status: 400 })
    }

    // 尝试解析Excel文件
    let citiesData: any[] = []

    try {
      const xlsx = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = xlsx.read(buffer, { type: 'array' })

      if (!workbook.SheetNames.length) {
        return NextResponse.json({ error: 'Excel文件中没有工作表' }, { status: 400 })
      }

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(worksheet)

      if (!data.length) {
        return NextResponse.json({ error: 'Excel文件中没有数据' }, { status: 400 })
      }

      console.log(`Parsed ${data.length} rows from Excel`)

      // 转换数据
      citiesData = data.map((row: any) => {
        const cityData = {
          city_name: row.city_name || row['城市名'] || row['city_name'] || '',
          year: row.year || row['年份'] || row['year'] || '2024',
          base_min: Number(row.base_min || row['基数下限'] || row['base_min'] || 1900),
          base_max: Number(row.base_max || row['基数上限'] || row['base_max'] || 30000),
          rate: Number(row.rate || row['缴纳比例'] || row['rate'] || 0.15)
        }

        // 验证必填字段
        if (!cityData.city_name) {
          console.warn('Missing city_name in row:', row)
          return null
        }

        return cityData
      }).filter(Boolean)

      if (!citiesData.length) {
        return NextResponse.json({
          error: '没有有效的城市数据。请确保Excel文件包含city_name列。'
        }, { status: 400 })
      }

      console.log(`Successfully processed ${citiesData.length} cities`)

    } catch (parseError: any) {
      console.error('Excel parsing error:', parseError)
      return NextResponse.json({
        error: 'Excel文件解析失败',
        details: parseError.message || '请确保文件格式正确'
      }, { status: 400 })
    }

    // 尝试保存到数据库（如果可能）
    try {
      const { supabaseAdmin } = await import('@/lib/supabase')
      const { error } = await supabaseAdmin.from('cities').insert(citiesData)

      if (!error) {
        return NextResponse.json({
          message: '城市数据上传并保存成功',
          count: citiesData.length,
          data: citiesData
        })
      }

      console.log('Database save failed, using parsed data:', error.message)
    } catch (dbError) {
      console.log('Database connection failed, using parsed data')
    }

    // 如果数据库保存失败，返回解析的数据
    return NextResponse.json({
      message: '城市数据解析成功（使用本地模式）',
      count: citiesData.length,
      data: citiesData
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: '上传失败',
      details: error.message
    }, { status: 500 })
  }
}