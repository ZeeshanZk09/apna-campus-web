import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests', // Force HTTPS for all content
          },
        ],
      },
    ];
  },
  // Add these for better HTTPS enforcement
  trailingSlash: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
