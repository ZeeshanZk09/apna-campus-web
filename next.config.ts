import type { NextConfig } from 'next';
// import { createStyledComponentsTransformer } from 'babel-plugin-styled-components';
/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.app.github.dev', '*.devtunnels.ms'],
  experimental: {
    serverActions: {
      // allow Server Actions requests coming via these forwarded hostnames
      allowedOrigins: ['*.app.github.dev', '*.devtunnels.ms', 'localhost:3000'],
    },
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    if (!isProduction) return [];
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

// const {  } = require('babel-plugin-styled-components');
// createStyledComponentsTransformer;
export default nextConfig;
