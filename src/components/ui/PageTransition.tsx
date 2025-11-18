'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useHydrationFix } from '@/utils/HydrationFix';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const variants = {
    initial: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 18,
      scale: reduceMotion ? 1 : 0.995,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        opacity: { duration: 0.35, ease: 'easeOut' },
        y: { duration: 0.45, ease: 'easeOut' },
        scale: { duration: 0.45, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.995,
      transition: { duration: 0.28, ease: 'easeIn' },
    },
  } as const;

  const isHydrated = useHydrationFix(1000);

  if (!isHydrated) return null;

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={pathname}
        className='relative min-h-screen'
        initial='initial'
        animate='enter'
        exit='exit'
        variants={variants}
      >
        {/* Top progress shimmer (subtle) */}
        {!reduceMotion && (
          <motion.div
            className='absolute left-0 top-0 h-[3px] w-full origin-left bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-400/60 shadow-md'
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
            aria-hidden
          />
        )}

        {/* Subtle curtain/overlay that reveals content from bottom */}
        {!reduceMotion && (
          <motion.div
            className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-white/10 to-transparent'
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'circOut', delay: 0.06 }}
            aria-hidden
          />
        )}

        {/* Main content container */}
        <div className='relative z-0'>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
