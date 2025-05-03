/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**', // Updated to match /media/hospital_images/
      },
      {
        protocol: 'http',
        hostname: '192.168.254.152',
        port: '8000',
        pathname: '/media/**', // Add for network IP
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.254.152'], // Already correct
  },
};

module.exports = nextConfig;