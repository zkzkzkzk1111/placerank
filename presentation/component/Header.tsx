'use client';

import Image from 'next/image';
import '@/presentation/component/css/header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Image
          src="/logo.png"
          alt=""
          width={24}
          height={24}
        />
        <span className="header-text">브랜드AD</span>
      </div>
    </header>
  );
};

export default Header;
