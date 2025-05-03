/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**', // Updated for local dev
      },
      {
        protocol: 'http',
        hostname: '192.168.254.152',
        port: '8000',
        pathname: '/media/**', // For local network dev
      },
      {
        protocol: 'https',
        hostname: 'backend-bwoh.onrender.com',
        pathname: '/media/**', // For production backend
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.254.152'], // Keep for dev
  },
};

module.exports = nextConfig;