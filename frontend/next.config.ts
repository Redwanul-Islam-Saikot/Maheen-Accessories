import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;

    // যদি Environment Variable সেট না থাকে তবে কোনো rewrite করবে না
    if (!adminUrl) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${adminUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;