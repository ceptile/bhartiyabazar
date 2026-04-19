import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,   // Hide "X-Powered-By: Next.js"

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],

  // Disable exposing build ID
  generateBuildId: async () => 'bhartiyabazar-build',
};

export default nextConfig;