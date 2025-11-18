'use client';
import React from 'react';

import { HeaderForDesktop } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/PageTransition';
import { ThemeProvider } from '@/hooks/ThemeChanger';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import DynamicBackground from '@/components/ui/Bg';
import AppProviders from '@/lib/provider/AppProvider';
import ToastProvider from '@/lib/provider/ToastProvider';
import { usePathname } from 'next/navigation';
const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Apna Campus',
  description: 'Portfolio showcasing educational projects and campus initiatives',
  url: 'https://apna-campus.netlify.app', // Replace with actual domain
  logo: 'https://apna-campus.netlify.app/logo/apna-campus-logo.png', // Replace with actual logo URL
  sameAs: ['https://twitter.com/apna-campus', 'https://github.com/apna-campus'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  console.log(pathName);

  return (
    <>
      <head>
        <StructuredData data={organizationStructuredData} />
        <Suspense fallback={<Loading />}>
          <GoogleAnalytics />
        </Suspense>
        <script
          id='Cookiebot'
          src='https://consent.cookiebot.com/uc.js'
          data-cbid='c3924214-275c-42e2-9630-5f5b92def79b'
          type='text/javascript'
          async
        ></script>
      </head>
      <body
        className={`transition-all duration-300 antialiased bg-gradient-to-b from-[#f5f9ff] to-[#e6f0ff] dark:bg-[#081015]`}
        suppressHydrationWarning
      >
        <AppProviders>
          <PageTransition>
            <ThemeProvider>
              <DynamicBackground>
                <HeaderForDesktop />
                <main id='min-h-screen main-content' tabIndex={-1}>
                  {(<ToastProvider />) as React.ReactNode}
                  {children}
                </main>
                <Footer />
              </DynamicBackground>
            </ThemeProvider>
          </PageTransition>
        </AppProviders>
      </body>
    </>
  );
}
