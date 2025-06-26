"use client";

import React from 'react';
import { useRanks } from '../hook/Rank';

interface RankTableData {
  companyName: string;
  keyword: string;
  placeId: number;
  dateRanks: { [date: string]: number };
}

export const RankMain: React.FC = () => {
  const { ranks, loading, error } = useRanks();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

 
  const processTableData = () => {
    
    const padZero = (num: number) => num < 10 ? `0${num}` : `${num}`;

    const allDates = [...new Set(ranks.map(rank => {
    const date = new Date(rank.createdDate);
    return `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    }))].sort((a, b) => {
    const [aMonth, aDay] = a.split('-').map(Number);
    const [bMonth, bDay] = b.split('-').map(Number);
    return new Date(2024, bMonth - 1, bDay).getTime() - new Date(2024, aMonth - 1, aDay).getTime();
    }).slice(0, 5);

   
    const groupedData = new Map<string, RankTableData>();

    ranks.forEach(rank => {
  
      const date = new Date(rank.createdDate);
      const dateKey = `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
      
      // 최대 5개 날짜에 포함되지 않으면 건너뛰기
      if (!allDates.includes(dateKey)) return;

      const key = `${rank.search_query}_${rank.place_id}`;
      
      if (!groupedData.has(key)) {
        groupedData.set(key, {
          companyName: '', // 비워둠
          keyword: rank.search_query,
          placeId: rank.place_id,
          dateRanks: {}
        });
      }

      const data = groupedData.get(key)!;
      data.dateRanks[dateKey] = rank.rank_position;
    });

    return {
      dates: allDates,
      data: Array.from(groupedData.values())
    };
  };

  const { dates, data } = processTableData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">랭킹 현황</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">업체명</th>
              <th className="border border-gray-300 px-4 py-2 text-left">키워드</th>
              <th className="border border-gray-300 px-4 py-2 text-left">플레이스ID</th>
              {dates.map(date => (
                <th key={date} className="border border-gray-300 px-4 py-2 text-center">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {row.companyName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.keyword}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.placeId}
                </td>
                {dates.map(date => (
                  <td key={date} className="border border-gray-300 px-4 py-2 text-center">
                    {row.dateRanks[date] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          표시할 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};