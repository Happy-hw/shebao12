'use client'

import { useState } from 'react'

export default function TestUploadPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult(data)

      if (response.ok) {
        console.log('Success:', data)
      } else {
        console.error('Error:', data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setResult({ error: 'Network error', details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">Excel上传测试</h1>

      <div className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择Excel文件
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={testUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {loading && (
          <div className="text-blue-600">正在处理...</div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <a href="/upload" className="text-blue-600 hover:underline">
            返回上传页面
          </a>
        </div>
      </div>
    </div>
  )
}