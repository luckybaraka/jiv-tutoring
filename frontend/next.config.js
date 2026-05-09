/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    // Optional: proxy /api/backend/* to backend during dev
    return [];
  },
};

module.exports = nextConfig;
