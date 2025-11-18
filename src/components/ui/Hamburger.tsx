'use client';
import { useTheme } from '@/hooks/ThemeChanger';
import React from 'react';

const Hamburger = ({ handleClick }: { handleClick: () => void }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      onClick={handleClick}
      className={`sm:hidden flex flex-col gap-3 ${isDarkMode ? `invert` : ''}`}
    >
      <span className='bg-black rounded-full h-0.5 w-10 line-clamp-1' />
      <span className='bg-black rounded-full h-0.5 w-10 line-clamp-1' />
      <span className='bg-black rounded-full h-0.5 w-10 line-clamp-1' />
    </div>
  );
};
export default Hamburger;
