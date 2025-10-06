'use client';

import Image from 'next/image';
import React from 'react';
import Navigation, { navLinksDataMobile } from '../ui/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logout from '../ui/Logout';
import Hamburger from '../ui/Hamburger';
import { User } from '@/app/generated/prisma/browser';
import { fetchUser } from '@/app/actions/getUser';
import axios from 'axios';
import ThemeButton from '../ui/ThemeButton';
import { useTheme } from '@/hooks/ThemeChanger';
const HeaderForDesktop = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sideBar, setSideBar] = useState(false);
  const { isDarkMode } = useTheme();
  const router = useRouter();

  console.log(sideBar);
  useEffect(() => {
    const loadUser = async () => {
      const { user, loading } = await fetchUser();
      // console.log('useEffect: ', user, loading, fetchUser);
      setUser(user ?? null);
      setLoading(loading!);
    };

    loadUser();

    if (sideBar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sideBar]);

  console.log(user);

  const handleLogout = async () => {
    try {
      const result = await axios.post('/api/auth/logout');
      console.log(result);
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };
  // bg-[radial-gradient(circle,_#081015,_#08101580,_#08101510,_transparent)]
  return (
    <header className='h-fit flex flex-col pt-2 px-4 sm:px-6 lg:px-16 '>
      <div className={` items-center flex justify-between w-full pb-2`}>
        <Image
          className='bg-black flex items-center justify-center  rounded-full w-[4rem] sm:w-[6rem]  object-fill '
          src={`/logo/apna-campus-logo.png`}
          alt='Logo'
          width={1000}
          height={1000}
        />
        <Hamburger handleClick={() => setSideBar(!sideBar)} />

        {/* Modal-style sidebar / popup */}
        {sideBar && (
          <>
            {/* Backdrop (click to close) */}
            <div
              className='fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300'
              onClick={() => setSideBar(false)}
              aria-hidden='true'
            />

            {/* Centered dialog wrapper with safe spacing from viewport edges */}
            <div
              className='fixed inset-4 z-30 flex items-center justify-center'
              // keep focus in dialog if needed (use focus-trap lib for production)
            >
              {/* The popup card */}
              <div
                role='dialog'
                aria-modal='true'
                aria-label='Mobile Menu'
                className={`relative w-full max-w-sm max-h-[90vh] overflow-auto rounded-2xl
                    bg-white/40 dark:bg-gray-900/75 backdrop-blur-md
                    shadow-2xl ring-1 ring-gray-900/5
                    transform transition-all duration-300 ease-out
                    scale-100 opacity-100 ${isDarkMode ? 'invert' : ''}`}
                style={{ WebkitBackdropFilter: 'blur(8px)' }}
              >
                <button
                  onClick={() => setSideBar(false)}
                  className='absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-1.5
                     hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
                  aria-label='Close menu'
                >
                  <span className='text-lg leading-none'>✕</span>
                </button>
                {/* Content */}
                <div className='space-y-2 pl-4 pt-6'>
                  {navLinksDataMobile.map(({ id, path, label }) => (
                    <Link
                      key={id}
                      href={path}
                      className={`max-w-[18rem] block rounded-lg p-2 text-base font-medium transition-colors
                         ${
                           isDarkMode ? 'text-gray-100 bg-gray-800/40' : 'text-gray-700 bg-gray-100'
                         }`}
                      onClick={() => setSideBar(false)}
                    >
                      {label}
                    </Link>
                  ))}

                  {/* Divider + theme button aligned nicely */}
                  <div className='my-2'>
                    <ThemeButton />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className='hidden sm:flex flex-col gap-y-4 items-start'>
          <Navigation />
          <div className='w-full flex justify-between items-center'>
            <ThemeButton />
            <div>
              {loading ? null : user ? (
                <div>
                  <Link href='/profile'>Profile</Link>
                  {user.role === 'TEACHER' && <Link href='/admin/dashboard'>Admin</Link>}
                  <Logout handleClick={handleLogout} />
                </div>
              ) : (
                <div className='space-x-1'>
                  <Link
                    href='/login'
                    className='py-2 px-4 rounded hover:bg-blue-500 transition duration-300'
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className=' bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600 transition duration-300'
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr
        className={`border-t transition-colors ${
          isDarkMode ? 'border-white/8' : 'border-gray-300'
        }`}
      />
    </header>
  );
};

export { HeaderForDesktop };
