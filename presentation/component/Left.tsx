'use client';

import '@/presentation/component/css/left.css';
import Link from 'next/link';

interface LeftProps {
  nickname: string;
}

const Left = ({ nickname }: LeftProps) => {
  return (
    <div className="left-container">
      <div className="nickname-section">
        <span>{nickname}님</span>
      </div>
      
      <nav className="menu-section">
        <ul className="menu-list">
          <li className="menu-item">
            <Link href="/" className="menu-link">
              메인페이지
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/chart" className="menu-link">
              차트
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Left;