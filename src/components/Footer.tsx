'use client';
import { useHydrationFix } from '@/utils/HydrationFix';
import React, { useEffect, useState } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  // const [mount, setMount] = useState(false);
  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to your API or marketing tool
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  }

  const isHydrated = useHydrationFix(1000);

  if (!isHydrated) return null;

  return (
    <footer aria-labelledby='footer-heading' className='w-full bg-transparent relative z-10 py-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Top block: card-like, transparent with blur */}
        <div className='rounded-2xl bg-white/6 backdrop-blur-md border border-white/8 p-8 mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 items-start'>
            {/* Brand */}
            <div className='md:col-span-4'>
              <h2 id='footer-heading' className='text-xl font-semibold text-white'>
                Apna Campus
              </h2>
              <p className='mt-2 text-sm text-gray-200 max-w-sm'>
                Single-institute student management — attendance, fees, courses, and parent
                communications in one place.
              </p>

              <div className='mt-4 flex items-center gap-3 text-sm text-gray-300'>
                <FaEnvelope aria-hidden className='text-gray-300' />
                <a href='mailto:support@apnacampus.example' className='hover:underline'>
                  support@apnacampus.example
                </a>
              </div>

              <div className='mt-3 flex items-center gap-3 text-sm text-gray-300'>
                <FaPhone aria-hidden className='text-gray-300' />
                <a href='tel:+922112345678' className='hover:underline'>
                  +92 21 1234 5678
                </a>
              </div>
            </div>

            {/* Sitemap / Links */}
            <div className='md:col-span-5 grid grid-cols-2 gap-6'>
              <div>
                <h3 className='text-sm font-medium text-gray-100'>Product</h3>
                <ul className='mt-3 space-y-2 text-sm text-gray-300'>
                  <li>
                    <a href='/dashboard' className='hover:text-white'>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href='/students' className='hover:text-white'>
                      Students
                    </a>
                  </li>
                  <li>
                    <a href='/attendance' className='hover:text-white'>
                      Attendance
                    </a>
                  </li>
                  <li>
                    <a href='/fees' className='hover:text-white'>
                      Finance
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-medium text-gray-100'>Resources</h3>
                <ul className='mt-3 space-y-2 text-sm text-gray-300'>
                  <li>
                    <a href='/docs' className='hover:text-white'>
                      Docs
                    </a>
                  </li>
                  <li>
                    <a href='/support' className='hover:text-white'>
                      Support
                    </a>
                  </li>
                  <li>
                    <a href='/status' className='hover:text-white'>
                      System Status
                    </a>
                  </li>
                  <li>
                    <a href='/privacy' className='hover:text-white'>
                      Privacy & Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter + Social */}
            <div className='md:col-span-3'>
              <h3 className='text-sm font-medium text-gray-100'>Stay updated</h3>

              <form
                onSubmit={handleSubscribe}
                className='mt-3 flex flex-col sm:flex-row gap-3'
                aria-label='Subscribe to newsletter'
              >
                <label htmlFor='footer-email' className='sr-only'>
                  Email address
                </label>
                <input
                  id='footer-email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  className='w-full px-3 py-2 rounded-md bg-white/5 border border-white/6 placeholder:text-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400'
                />
                <button
                  type='submit'
                  className='px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium'
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </form>

              <p className='mt-3 text-xs text-gray-400'>No spam — unsubscribe any time.</p>

              <div className='mt-4 flex items-center gap-3'>
                <a aria-label='Facebook' href='#' className='p-2 rounded-md hover:bg-white/6'>
                  <FaFacebookF />
                </a>
                <a aria-label='Twitter' href='#' className='p-2 rounded-md hover:bg-white/6'>
                  <FaTwitter />
                </a>
                <a aria-label='Instagram' href='#' className='p-2 rounded-md hover:bg-white/6'>
                  <FaInstagram />
                </a>
                <a aria-label='LinkedIn' href='#' className='p-2 rounded-md hover:bg-white/6'>
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* hr divider */}
        <hr className='mt-6 border-t border-white/8' />

        {/* Bottom row: legal, language, copyright */}
        <div className='mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-300'>
          <div className='flex items-center gap-4'>
            <span>© {new Date().getFullYear()} Apna Campus, Inc.</span>
            <a href='/legal' className='hover:underline'>
              Legal
            </a>
            <a href='/cookies' className='hover:underline'>
              Cookies
            </a>
          </div>

          <div className='flex items-center gap-3'>
            {/* small language selector — accessible */}
            <label htmlFor='locale' className='sr-only'>
              Select language
            </label>
            <div className='flex items-center gap-2 bg-white/3 rounded-md px-3 py-1'>
              <FaGlobe aria-hidden />
              <select
                id='locale'
                defaultValue='en'
                className='bg-transparent text-sm focus:outline-none'
              >
                <option value='en'>English</option>
                <option value='ur'>اردو</option>
              </select>
            </div>

            <span className='text-xs text-gray-400'>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
