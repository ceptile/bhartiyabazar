import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,

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
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // NOTE: X-Frame-Options: DENY removed — it blocks Firebase OAuth popup/redirect flow
      ],
    },
  ],

  generateBuildId: async () => 'bhartiyabazar-build',
};

export default nextConfig;
