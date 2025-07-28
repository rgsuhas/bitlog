/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
    reactStrictMode: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
