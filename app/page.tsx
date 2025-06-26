'use client'; 

import Header from '@/presentation/component/Header';
import Left from '@/presentation/component/Left';
import { RankMain } from '../presentation/component/RankMain';


export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <Header />
      {/* 본문: 왼쪽 메뉴 + 오른쪽 콘텐츠 */}
      <div className="flex flex-1">
        <Left nickname="김이지" />

        <div className="flex-1 p-6">
          {/* 오른쪽 메인 콘텐츠 */}
          <h1 className="text-xl font-bold mb-4">네이버 플레이스 상위노출</h1>
          <RankMain />
        </div>
      </div>
    </div>
  );
}
