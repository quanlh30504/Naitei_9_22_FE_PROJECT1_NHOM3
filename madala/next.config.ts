/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Add this for development
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // --- Cấu hình mới cho GitHub Avatars ---
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
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

module.exports = nextConfig;
