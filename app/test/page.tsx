'use client'

import { useState } from 'react'

interface RankResult {
  search_query: string
  place_id: string
  rank: number | null
  total_results: number
  message?: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [result, setResult] = useState<RankResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery || !placeId) {
      setError('검색어와 Place ID를 모두 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/api/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search_query: searchQuery,
          place_id: placeId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: RankResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(`API 호출 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          NAVER 순위 검색
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
                검색어
              </label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 울산치킨"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-2">
                Place ID
              </label>
              <input
                type="text"
                id="placeId"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                placeholder="예: 16319840"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '검색 중...' : '순위 검색'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">검색 결과</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">검색어</h3>
                <p className="text-lg text-gray-900">{result.search_query}</p>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Place ID</h3>
                <p className="text-lg text-gray-900">{result.place_id}</p>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">순위</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {result.rank !== null ? `${result.rank}위` : '순위 없음'}
                </p>
              </div>
       
            </div>
            
            {result.message && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">{result.message}</p>
              </div>
            )}
          </div>
        )}
 
      </div>
    </div>
  )
}