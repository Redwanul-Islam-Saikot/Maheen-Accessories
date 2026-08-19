import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maheen-accessories.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary বা কোনো ইমেজ ট্রাফিকের জন্য
      },
    ],
  },
  async rewrites() {
    // ব্যাকএন্ড URL হিসেবে সরাসরি সেট করে দেওয়া হয়েছে
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'https://maheen-accessories.vercel.app';

    return [
      {
        source: '/api/:path*',
        destination: `${adminUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
