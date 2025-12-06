/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
      {
        protocol: 'https',
        hostname: '**.replicate.com',
      },
      {
        protocol: 'https',
        hostname: '**.stability.ai',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

module.exports = nextConfig

