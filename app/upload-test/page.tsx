'use client'

import { useState } from 'react'

export default function UploadTestPage() {
  const [message, setMessage] = useState('')

  const uploadCities = async () => {
    try {
      const res = await fetch('/api/upload/cities/easy-route', {
        method: 'POST'
      })
      const data = await res.json()
      setMessage(`城市上传: ${data.message}`)
    } catch (error) {
      setMessage(`城市上传失败: ${error}`)
    }
  }

  const uploadSalaries = async () => {
    try {
      const res = await fetch('/api/upload/salaries/easy-route', {
        method: 'POST'
      })
      const data = await res.json()
      setMessage(`工资上传: ${data.message}`)
    } catch (error) {
      setMessage(`工资上传失败: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">上传测试页面</h1>

      <div className="space-y-4">
        <button
          onClick={uploadCities}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          上传城市数据（测试）
        </button>

        <button
          onClick={uploadSalaries}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          上传工资数据（测试）
        </button>

        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <pre className="whitespace-pre-wrap">{message}</pre>
        </div>
      </div>

      <div className="mt-8">
        <a href="/upload" className="text-blue-500 hover:underline">返回上传页面</a>
      </div>
    </div>
  )
}