import { useState, useEffect } from 'react';
import {fromRankEntityList, RankModel} from '../model/RankModel';


export const useRanks = () => {
  const [ranks, setRanks] = useState<RankModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/rank');
      if (!res.ok) throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.');

      const data = await res.json();

      const rankModels = fromRankEntityList(data);
      setRanks(rankModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      console.error('useRanks fetchRanks error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  return {
    ranks,
    loading,
    error,
    refetch: fetchRanks
  };
};
