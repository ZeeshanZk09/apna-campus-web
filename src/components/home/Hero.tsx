'use client';

import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/hooks/ThemeChanger';

export default function HomeHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const heading = (
    <h1 className='text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight'>
      <span
        className={`block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400`}
      >
        Unlock Your Future
      </span>
      <span className={`block text-gray-500`}>with Quality Learning</span>
    </h1>
  );

  return (
    <section className='max-w-7xl sm:mx-auto px-4 sm:px-6 lg:px-8  text-gray-200'>
      <div
        className={`rounded-2xl ${
          isDarkMode
            ? 'bg-white/6 backdrop-blur border border-white/8'
            : 'bg-black/6 backdrop-blur border border-black/8'
        } px-4 py-6 sm:px-16 mt-2 shadow-lg`}
      >
        <div className='overflow-hidden sm:max-h-[78vh] grid grid-cols-1 lg:grid-cols-12 items-center gap-2 lg:gap-12'>
          {/* LEFT: Text + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='lg:col-span-7'
            aria-hidden={false}
          >
            {heading}

            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} max-w-xl`}>
              Join a community of learners who are passionate about gaining new skills and advancing
              their careers. Interactive projects, mentors, and certificates.
            </p>

            {/* CTA Row */}
            <div className='mt-6 flex items-center flex-wrap'>
              {/* Secondary CTA */}
              <Link
                href='#courses'
                className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } inline-flex items-center justify-center rounded-md border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
              >
                Explore Courses
              </Link>
            </div>

            {/* Small features */}
            <ul
              className={`mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm ${
                isDarkMode ? `text-gray-400` : `text-gray-600`
              } max-w-md`}
            >
              <li className='flex items-start gap-3'>
                <svg
                  className='w-5 h-5 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>
                  Mentor-led projects{' '}
                  <span className={isDarkMode ? `text-gray-200` : `text-gray-500`}>
                    — real-world practice
                  </span>
                </span>
              </li>

              <li className='flex items-start gap-3'>
                <svg
                  className='w-5 h-5 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden
                >
                  <path d='M10 2a6 6 0 100 12A6 6 0 0010 2zM2 18a8 8 0 1116 0H2z' />
                </svg>
                <span>
                  Certificate of completion{' '}
                  <span className={isDarkMode ? `text-gray-200` : `text-gray-500`}>
                    — shareable
                  </span>
                </span>
              </li>

              <li className='flex items-start gap-3'>
                <svg
                  className='w-5 h-5 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden
                >
                  <path d='M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 2V5z' />
                </svg>
                <span>
                  Active community{' '}
                  <span className={isDarkMode ? `text-gray-200` : `text-gray-500`}>
                    — get help fast
                  </span>
                </span>
              </li>
            </ul>
          </motion.div>

          {/* RIGHT: Animated piece (Lottie with card + fallback) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className='lg:col-span-5 flex justify-end'
          >
            <div className='w-full max-w-md'>
              <div className='relative rounded-2xl overflow-hidden'>
                <div className='sm:scale-90 aspect-[4/5] w-full'>
                  <DotLottieReact
                    src='https://lottie.host/35e0b9a5-364d-4f31-b2b7-5c744cc0b0ff/nUeOXrYiV6.lottie'
                    autoplay
                    loop
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    aria-hidden={false}
                    title='Hero animation'
                  />
                </div>
                <div className='transform  -translate-y-8 sm:-translate-y-15 text-xs text-gray-400 text-center'>
                  Interactive preview · lightweight
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
