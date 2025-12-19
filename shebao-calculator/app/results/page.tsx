'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Result {
  id: number
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  created_at: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [totalFee, setTotalFee] = useState(0)

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, selectedCity, selectedYear])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results')
      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
        setTotalFee(data.total)

        // 提取唯一的城市和年份
        const uniqueCities = [...new Set(data.results.map((r: Result) => r.city_name))]
        const uniqueYears = [...new Set(data.results.map((r: Result) => r.year))]
        setCities(uniqueCities)
        setYears(uniqueYears)
      }
    } catch (error) {
      console.error('获取结果失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterResults = () => {
    let filtered = results

    if (selectedCity) {
      filtered = filtered.filter(r => r.city_name === selectedCity)
    }

    if (selectedYear) {
      filtered = filtered.filter(r => r.year === selectedYear)
    }

    setFilteredResults(filtered)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    )
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            计算结果
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            查看员工社保费用计算结果
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">员工总数</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredResults.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">总缴纳金额</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(
                filteredResults.reduce((sum, r) => sum + r.company_fee, 0)
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">平均缴纳金额</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredResults.length > 0
                ? formatCurrency(
                    filteredResults.reduce((sum, r) => sum + r.company_fee, 0) / filteredResults.length
                  )
                : formatCurrency(0)
              }
            </p>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                城市
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">全部城市</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                年份
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">全部年份</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 结果表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {results.length === 0 ? '暂无计算结果，请先上传数据并执行计算' : '没有符合筛选条件的结果'}
              </p>
              {results.length === 0 && (
                <Link
                  href="/upload"
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  去上传数据
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      员工姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      城市
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      年份
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      平均工资
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      缴费基数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      公司缴纳
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {result.city_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {result.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(result.avg_salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(result.contribution_base)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(result.company_fee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {filteredResults.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              打印报表
            </button>
          </div>
        )}
      </div>
    </div>
  )
}