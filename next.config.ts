/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/hospital_images/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.254.152'], // Add this to suppress the dev warning
  },
};

module.exports = nextConfig;
