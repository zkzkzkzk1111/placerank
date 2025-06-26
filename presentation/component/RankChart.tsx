// component/RankChart.tsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useRankChart } from '../hook/RankChart';

interface RankChartProps {
  height?: number;
  width?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

// 차트 라인 색상 배열
const LINE_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#6b7280', // gray
];

export const RankChart: React.FC<RankChartProps> = ({
  height = 400,
  width = '100%',
  showGrid = true,
  showLegend = true
}) => {
  const { chartData, searchQueries, loading, error, refetch } = useRankChart();
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);

  useEffect(() => {
    if (searchQueries.length > 0) {
      setSelectedQueries(searchQueries);
    }
  }, [searchQueries]);

  const handleSelectAll = () => {
    if (selectedQueries.length === searchQueries.length) {
      setSelectedQueries([]); // 전체 해제
    } else {
      setSelectedQueries(searchQueries); // 전체 선택
    }
  };

  // 개별 검색어 선택/해제
  const handleToggleQuery = (query: string) => {
    setSelectedQueries(prev => {
      if (prev.includes(query)) {
        return prev.filter(q => q !== query); // 제거
      } else {
        return [...prev, query]; // 추가
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">오류: {error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">표시할 데이터가 없습니다.</div>
      </div>
    );
  }

  // 선택된 검색어들에 대한 최대 랭킹 값을 구해서 Y축 domain 설정
  const maxRank = selectedQueries.length > 0 ? Math.max(
    ...chartData.flatMap(item => 
      selectedQueries.map(query => (item[query] as number) || 0)
    )
  ) : 100;

  return (
    <div className="w-full">
      {/* 검색어 선택 컨트롤 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-2 items-center">
          
          {/* 전체 선택/해제 버튼 */}
          <button
            onClick={handleSelectAll}
            className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${
              selectedQueries.length === searchQueries.length
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                : selectedQueries.length === 0
                ? 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
                : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
            }`}
          >
            {selectedQueries.length === searchQueries.length 
              ? '전체 해제' 
              : selectedQueries.length === 0 
              ? '전체 선택'
              : `전체 선택 (${selectedQueries.length}/${searchQueries.length})`
            }
          </button>

          {/* 개별 검색어 버튼들 */}
          {searchQueries.map((query, index) => (
            <button
              key={query}
              onClick={() => handleToggleQuery(query)}
              style={{
                backgroundColor: selectedQueries.includes(query) 
                  ? LINE_COLORS[index % LINE_COLORS.length] 
                  : 'transparent',
                borderColor: LINE_COLORS[index % LINE_COLORS.length],
                color: selectedQueries.includes(query) 
                  ? 'white' 
                  : LINE_COLORS[index % LINE_COLORS.length]
              }}
              className={`px-3 py-1 text-sm rounded-full border-2 transition-colors hover:opacity-80 ${
                selectedQueries.includes(query) ? 'shadow-sm' : 'hover:bg-gray-50'
              }`}
            >
              {query}
            </button>
          ))}
        </div>
        
        {selectedQueries.length === 0 && (
          <div className="mt-2 text-sm text-gray-500">
            최소 하나의 검색어를 선택해주세요.
          </div>
        )}
      </div>

      {/* 색상 범례 - 선택된 검색어만 표시 */}
      {selectedQueries.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          {selectedQueries.map((query) => {
            const index = searchQueries.indexOf(query);
            return (
              <div 
                key={query}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: LINE_COLORS[index % LINE_COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-700">{query}</span>
              </div>
            );
          })}
        </div>
      )}
      {selectedQueries.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">검색어를 선택해주세요.</div>
        </div>
      ) : (
        <ResponsiveContainer width={width} height={height}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
            
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickLine={true}
              axisLine={true}
              padding={{ left: 40, right: 40 }}
            />
            
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={true}
              axisLine={true}
              domain={[maxRank, 1]} // Y축 범위를 1~maxRank로 설정
              reversed={true} // 랭킹은 낮을수록 좋으므로 Y축 뒤집기
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelFormatter={(value: any) => `날짜: ${value}`}
              formatter={(value: any, name: any) => [
                value ? `${value}위` : '데이터 없음', 
                name
              ]}
            />
            
            {/* 차트 내부 범례 제거 */}
            {/* {showLegend && (
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="line"
              />
            )} */}
            
            {/* 선택된 search_query들에 대해서만 라인 생성 */}
            {searchQueries.map((query, index) => 
              selectedQueries.includes(query) ? (
                <Line
                  key={query}
                  type="monotone"
                  dataKey={query}
                  stroke={LINE_COLORS[index % LINE_COLORS.length]}
                  strokeWidth={3}
                  dot={{ 
                    fill: LINE_COLORS[index % LINE_COLORS.length], 
                    stroke: '#fff', 
                    strokeWidth: 2, 
                    r: 5 
                  }}
                  activeDot={{ 
                    r: 7, 
                    stroke: LINE_COLORS[index % LINE_COLORS.length], 
                    strokeWidth: 2 
                  }}
                  connectNulls={false} // null 값이 있는 경우 선을 끊음
                  name={query} // 범례에 표시될 이름
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};