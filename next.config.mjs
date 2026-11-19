/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  basePath: '/weather-app', 
  images: {
    unoptimized: true, 
  },
};

module.exports = nextConfig;