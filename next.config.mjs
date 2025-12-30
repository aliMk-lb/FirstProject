/** @type {import('next').NextConfig} */

const nextConfig = {
  // No custom basePath/assetPrefix so the app serves at the root on Vercel
  images: {
    unoptimized: true,
    qualities: [50, 75, 100],
  },
  trailingSlash: true,
};

export default nextConfig;
