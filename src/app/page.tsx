'use client';

import React, { useEffect, useState } from 'react';
import GetStart from '@/components/ui/GetStart';
import HeroImgUI from '@/components/ui/HeroImgUI';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const heading = (
    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight'>
      <span className='block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400'>
        Unlock Your Future
      </span>
      <span className='block'>with Quality Learning</span>
    </h1>
  );

  return (
    <main className='overflow-x-hidden'>
      <section className='relative px-4 sm:px-6 md:px-8 lg:px-10 w-full py-10 sm:py-14 md:py-18 min-h-[80vh] text-gray-200'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12'>
            {/* LEFT: Text + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className='lg:col-span-7'
              aria-hidden={false}
            >
              {heading}

              <p className='mt-4 sm:mt-6 text-gray-400 max-w-xl'>
                Join a community of learners who are passionate about gaining new skills and
                advancing their careers. Interactive projects, mentors, and certificates.
              </p>

              {/* CTA Row */}
              <div className='mt-6 flex items-center gap-4 flex-wrap'>
                {/* Secondary CTA */}
                <Link
                  href='#courses'
                  className='inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300'
                >
                  Explore Courses
                </Link>
              </div>

              {/* Small features */}
              <ul className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 max-w-md'>
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
                    Mentor-led projects <span className='text-gray-300'>— real-world practice</span>
                  </span>
                </li>

                <li className='flex items-start gap-3'>
                  <svg
                    className='w-5 h-5 mt-1 flex-shrink-0'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    aria-hidden
                  >
                    <path d='M10 2a6 6 0 100 12A6 6 0 0010 2zM2 18a8 8 0 1116 0H2z' />
                  </svg>
                  <span>
                    Certificate of completion <span className='text-gray-300'>— shareable</span>
                  </span>
                </li>

                <li className='flex items-start gap-3'>
                  <svg
                    className='w-5 h-5 mt-1 flex-shrink-0'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    aria-hidden
                  >
                    <path d='M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 2V5z' />
                  </svg>
                  <span>
                    Active community <span className='text-gray-300'>— get help fast</span>
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
                <div className='relative rounded-2xl overflow-hidden shadow-2xl backdrop-blur p-4'>
                  <div className='aspect-[4/5] w-full'>
                    <DotLottieReact
                      src='https://lottie.host/35e0b9a5-364d-4f31-b2b7-5c744cc0b0ff/nUeOXrYiV6.lottie'
                      autoplay
                      loop
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      aria-hidden={false}
                      title='Hero animation'
                    />
                  </div>
                  <div className='mt-3 text-xs text-gray-500 text-center'>
                    Interactive preview · lightweight
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
