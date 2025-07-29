/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
    reactStrictMode: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
