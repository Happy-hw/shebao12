'use client'

export default function SimpleUpload() {
  const [status, setStatus] = useState('')

  const testUpload = async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      setStatus('请选择文件')
      return
    }

    setStatus(`准备上传: ${file.name} (${file.size} bytes)`)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/cities', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      setStatus(`上传结果: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setStatus(`错误: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">简单上传测试</h1>

      <div className="mb-4">
        <input
          id="fileInput"
          type="file"
          accept=".xlsx,.xls"
          className="border p-2"
        />
      </div>

      <button
        onClick={testUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        测试上传
      </button>

      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {status || '等待上传...'}
      </pre>

      <div className="mt-8">
        <a href="/upload" className="text-blue-600 underline">返回上传页面</a>
      </div>
    </div>
  )
}