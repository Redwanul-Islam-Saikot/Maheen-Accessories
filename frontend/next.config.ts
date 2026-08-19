import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    // Vercel-এ Variable না থাকলেও এটি সরাসরি আসল URL নিবে
    const rawUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://maheen-accessories.vercel.app';
    
    // নিশ্চিত করছে URL-এর শুরুতে https:// আছে কি না
    const adminUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    return [
      {
        source: '/api/:path*',
        destination: `${adminUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;