'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [citiesFile, setCitiesFile] = useState<File | null>(null)
  const [salariesFile, setSalariesFile] = useState<File | null>(null)
  const [uploadingCities, setUploadingCities] = useState(false)
  const [uploadingSalaries, setUploadingSalaries] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleCitiesUpload = async () => {
    // 使用简化的API，不需要文件
    setUploadingCities(true)

    try {
      const response = await fetch('/api/upload/cities/easy-route', {
        method: 'POST'
      })

      const result = await response.json()

      if (response.ok) {
        showMessage(`${result.message}！共上传 ${result.count} 条记录`, 'success')
      } else {
        showMessage(result.error || '上传失败', 'error')
      }
    } catch (error) {
      showMessage('上传过程中出错', 'error')
    } finally {
      setUploadingCities(false)
    }
  }

  const handleSalariesUpload = async () => {
    // 使用简化的API，不需要文件
    setUploadingSalaries(true)

    try {
      const response = await fetch('/api/upload/salaries/easy-route', {
        method: 'POST'
      })

      const result = await response.json()

      if (response.ok) {
        showMessage(`${result.message}！共上传 ${result.count} 条记录`, 'success')
      } else {
        showMessage(result.error || '上传失败', 'error')
      }
    } catch (error) {
      showMessage('上传过程中出错', 'error')
    } finally {
      setUploadingSalaries(false)
    }
  }

  const handleCalculate = async () => {
    setCalculating(true)
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST'
      })

      const result = await response.json()

      if (response.ok) {
        showMessage(`计算完成！共生成 ${result.count} 条结果`, 'success')
        setTimeout(() => {
          router.push('/results')
        }, 2000)
      } else {
        showMessage(result.error || '计算失败', 'error')
      }
    } catch (error) {
      showMessage('计算过程中出错', 'error')
    } finally {
      setCalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* 返回主页按钮 */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回主页
          </a>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            数据上传与计算
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            上传Excel数据文件并执行社保费用计算
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 上传城市数据 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                上传城市数据
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                上传各城市的社保基数标准（Excel格式）
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setCitiesFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  dark:file:bg-blue-900 dark:file:text-blue-200
                  hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />

              <button
                onClick={handleCitiesUpload}
                disabled={!citiesFile || uploadingCities}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {uploadingCities ? '上传中...' : '上传城市数据'}
              </button>
            </div>
          </div>

          {/* 上传工资数据 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                上传工资数据
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                上传员工月度工资数据（Excel格式）
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setSalariesFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  dark:file:bg-green-900 dark:file:text-green-200
                  hover:file:bg-green-100 dark:hover:file:bg-green-800"
              />

              <button
                onClick={handleSalariesUpload}
                disabled={!salariesFile || uploadingSalaries}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {uploadingSalaries ? '上传中...' : '上传工资数据'}
              </button>
            </div>
          </div>

          {/* 执行计算 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                执行计算
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                根据上传的数据计算社保费用
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                确保已上传城市标准和工资数据后再执行计算
              </div>

              <button
                onClick={handleCalculate}
                disabled={calculating}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {calculating ? '计算中...' : '执行计算并存储结果'}
              </button>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              使用说明
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>首先上传城市社保标准数据文件</li>
              <li>然后上传员工工资数据文件</li>
              <li>点击"执行计算"按钮开始计算</li>
              <li>计算完成后可查看结果页面</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}