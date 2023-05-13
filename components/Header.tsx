import React, { useState, useEffect } from 'react';
import { GoSearch } from 'react-icons/go';
import { AiFillBell } from 'react-icons/ai';
import Link from 'next/link';
import BasicMenu from './BasicMenu';

const Header = () => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${isScroll && 'bg-[#141414]'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          width={100}
          height={100}
          alt="logo"
          className="cursor-pointer object-contain"
        />
        <BasicMenu />
        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">首頁</li>
          <li className="headerLink">節目</li>
          <li className="headerLink">電影</li>
          <li className="headerLink">最新熱門影片</li>
          <li className="headerLink">我的片單</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
        <GoSearch className="hidden h-6 w-6 sm:inline" />
        <p className="hidden lg:inline">兒童專區</p>
        <AiFillBell className="hidden h-6 w-6 sm:inline" />
        <Link href="/account">
          <img
            src="https://occ-0-1190-2774.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41"
            alt="avatar"
            className="cursor-pointer rounded"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
