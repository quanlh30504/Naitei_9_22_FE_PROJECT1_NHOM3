/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  typescript: {
    // Bỏ qua lỗi TypeScript khi build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
};


const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  reportFilename: path.resolve(__dirname, 'analyze.html'),
});

module.exports = withBundleAnalyzer(nextConfig);
