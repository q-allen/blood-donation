/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['127.0.0.1'], // Add your API hostname here
    // OR use remotePatterns for more specific control:
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/hospital_images/**',
      },
    ],
  },
};

module.exports = nextConfig;