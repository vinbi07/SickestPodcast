import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'sickest-podcast.vercel.app' }],
        destination: 'https://sickest-podcast.sickfitofficial.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
