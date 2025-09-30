'use client';

import Image from 'next/image';
import React from 'react';
import Navigation, { navLinksData } from './ui/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logout from './ui/Logout';
import Hamburger from './ui/Hamburger';
import { User } from '@/app/generated/prisma/client/browser';
import { fetchUser } from '@/app/actions/getUser';
const HeaderForDesktop = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sideBar, setSideBar] = useState(false);
  // const router = useRouter();

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

  const handleLogout = () => {};

  if (loading) return null;
  return (
    <header className='h-fit flex flex-col  px-8  py-2 shadow-md shadow-blue-900 w-screen'>
      <nav className='px-2 backdrop-blur-3xl items-center flex justify-between w-full  '>
        <Image
          className='bg-[radial-gradient(circle,_#081015,_#08101580,_#08101510,_transparent)] flex items-center justify-center  rounded-full w-[4rem] sm:w-[6rem]  object-fill '
          src={`/logo/apna-campus-logo.png`}
          alt='Logo'
          width={1000}
          height={1000}
        />
        <Hamburger handleClick={() => setSideBar(!sideBar)} />
        {sideBar && (
          <div
            className={`z-30 transition-all duration-700 ease-in-out delay-700 transform
          ${sideBar ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-0 opacity-0'}
            lg:hidden absolute top-0 left-0 right-0  w-full p-3 sm:max-w-sm  bg-[#08688bb2] rounded  backdrop-blur-3xl`}
            role='dialog'
            aria-modal='true'
            aria-label='Mobile Menu'
            style={{ insetBlockStart: '0', top: '0' }}
          >
            <div className='space-y-4 py-3'>
              {navLinksData.map(({ id, path, label }) => (
                <Link
                  key={id}
                  href={path}
                  className=' block rounded-lg  text-base font-light text-white'
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className='hidden sm:flex flex-col justify-between items-end'>
          <Navigation />
        </div>
      </nav>
      <div className=' flex place-self-end items-center space-x-2'>
        {user ? (
          <>
            <Link href='/profile'>Profile</Link>
            {user.role === 'TEACHER' && <Link href='/admin/dashboard'>Admin</Link>}
            <button className='scale-75' onClick={handleLogout}>
              <Logout />
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
};

export { HeaderForDesktop };
