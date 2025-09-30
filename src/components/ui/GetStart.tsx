'use client';
import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/hooks/ThemeChanger';

type Props = { onClick?: any; children?: React.ReactNode; className?: string };

const GetStartMotion = forwardRef<HTMLButtonElement, Props>(
  ({ children = 'Browse Courses', onClick, className }, ref) => {
    const { isDarkMode } = useTheme();
    const reduceMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        type='button'
        onClick={onClick}
        className={`relative inline-flex items-center justify-center h-[76px] px-[30px] rounded-full group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00ffea]/20 ${
          className ?? ''
        }`}
        whileHover={reduceMotion ? {} : { scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.span
          aria-hidden
          initial={{ opacity: 1, scale: 1 }}
          whileHover={reduceMotion ? {} : { opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.35 }}
          className={`pointer-events-none absolute inset-[7px] rounded-full border-[3px] ${
            isDarkMode ? 'border-white' : 'border-black'
          }`}
        />

        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 1.3 }}
          whileHover={reduceMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className='pointer-events-none absolute inset-[7px] rounded-full border-[4px] border-[#00ffea]'
        />

        <span className={`relative z-10 flex items-center gap-2`}>
          <span className={isDarkMode ? 'text-white font-semibold' : 'text-black font-semibold'}>
            {children}
          </span>
          <svg viewBox='0 0 24 24' role='img' className='w-6 h-6' aria-hidden>
            <path
              fill={isDarkMode ? 'white' : 'black'}
              d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
            />
          </svg>
        </span>
      </motion.button>
    );
  }
);

GetStartMotion.displayName = 'GetStartMotion';
export default GetStartMotion;
