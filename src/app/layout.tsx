import type { Metadata, Viewport } from 'next';
import { HeaderForDesktop } from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/ui/PageTransition';
import { ThemeProvider } from '@/hooks/ThemeChanger';
import { Suspense } from 'react';
import Loading from './loading';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import DynamicBackground from '@/components/ui/Bg';
import AppProviders from '@/lib/provider/AppProvider';
import './../styles/globals.css';
// Organization schema for structured data
const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Apna Campus',
  description: 'Portfolio showcasing educational projects and campus initiatives',
  url: 'https://apna-campus.netlify.app', // Replace with actual domain
  logo: 'https://apna-campus.netlify.app/logo/apna-campus-logo.png', // Replace with actual logo URL
  sameAs: ['https://twitter.com/apna-campus', 'https://github.com/apna-campus'],
};

export const metadata: Metadata = {
  title: {
    default: 'Apna Campus - Student Management System',
    template: '%s | Apna Campus',
  },
  description:
    'Explore our portfolio of educational projects, campus initiatives, and innovative learning solutions at Apna Campus.',
  keywords: ['education', 'portfolio', 'campus', 'learning', 'projects', 'students'],
  authors: [{ name: 'Apna Campus Team' }],
  creator: 'Apna Campus',
  publisher: 'Apna Campus',
  metadataBase: new URL('https://apna-campus.netlify.app'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apna-campus.netlify.app', // Replace with actual domain
    siteName: 'Apna Campus',
    title: 'Apna Campus - Portfolio App',
    description: 'Explore our portfolio of educational projects and campus initiatives.',
    images: [
      {
        url: '/logo/apna-campus-logo.png', // Replace with actual Open Graph image
        width: 1200,
        height: 630,
        alt: 'Apna Campus Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apna Campus - Portfolio App',
    description: 'Explore our portfolio of educational projects and campus initiatives.',
    images: ['/logo/apna-campus-logo.png'], // Replace with actual Twitter image
    creator: '@apna-campus', // Replace with actual Twitter username
  },
  icons: {
    icon: [
      { url: '/logo/apna-campus-logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo/apna-campus-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/logo/apna-campus-logo.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo/apna-campus-logo.png',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest', // Consider adding a webmanifest file
  verification: {
    google: 'y0uZ9rBSwrh0w-LV0i1iBqPp-5rnm8yFlAc0k3drpCA', // Add Google Search Console verification
  },
  category: 'education',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#010101' },
    { media: '(prefers-color-scheme: dark)', color: '#ededed' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='dark scroll-smooth'>
      <head>
        <StructuredData data={organizationStructuredData} />
        <Suspense fallback={<Loading />}>
          <GoogleAnalytics />
        </Suspense>
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
                  {children}
                </main>
                <Footer />
              </DynamicBackground>
            </ThemeProvider>
          </PageTransition>
        </AppProviders>
      </body>
    </html>
  );
}
