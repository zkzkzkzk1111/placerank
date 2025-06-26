'use client';

import React from 'react';
import Header from '@/presentation/component/Header';
import Left from '@/presentation/component/Left';
import { RankChart } from '../../presentation/component/RankChart';
import '@/app/chart/css/chart.css'; 

export default function ChartPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <Header />
      {/* 본문: 왼쪽 메뉴 + 오른쪽 콘텐츠 */}
      <div className="flex flex-1">
        <Left nickname="김이지" />

        <div className="chart_div">
          <RankChart 
            height={500}
            showGrid={true}
            showLegend={true}
          />
        </div>
      </div>
    </div>
   
  );
}