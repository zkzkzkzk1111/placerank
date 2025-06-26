
import { useState, useEffect, useMemo } from 'react';
import { fromRankEntityList, RankModel } from '../model/RankModel';

interface ChartData {
  date: string;
  search_query: string;
  rank_position: number;
}

interface GroupedChartData {
  date: string;
  [key: string]: string | number;
}

function transformRanksToChartData(ranks: RankModel[]): { formattedData: GroupedChartData[], uniqueQueries: string[] } {
  const rawChartData: ChartData[] = ranks.map((rank, index) => ({
    date: rank.createdDate || `${index + 1}일차`,
    search_query: rank.search_query || 'Unknown',
    rank_position: rank.rank_position
  }));

  const uniqueQueries = [...new Set(rawChartData.map(item => item.search_query))];

  const groupedByDate = rawChartData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { date: item.date };
    }
    acc[item.date][item.search_query] = item.rank_position;
    return acc;
  }, {} as Record<string, GroupedChartData>);

  const formattedData = Object.values(groupedByDate).sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  return { formattedData, uniqueQueries };
}


export const useRankChart = () => {
  const [chartData, setChartData] = useState<GroupedChartData[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankChart = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/rank');
      if (!res.ok) throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.');

      const data = await res.json();
      const rankModels = fromRankEntityList(data);

      // 분리된 함수를 호출하여 가독성 향상
      const { formattedData, uniqueQueries } = transformRanksToChartData(rankModels);

      setChartData(formattedData);
      setSearchQueries(uniqueQueries);

    } catch (err) {
      setError(err instanceof Error ? err.message : '차트 데이터를 불러오는데 실패했습니다.');
      console.error('useRankChart fetchRankChart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankChart();
  }, []);

  return {
    chartData,
    searchQueries,
    loading,
    error,
    refetch: fetchRankChart
  };
};