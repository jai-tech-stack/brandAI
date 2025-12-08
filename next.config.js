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
  webpack: (config, { isServer }) => {
    // Externalize playwright to prevent webpack from trying to bundle it
    // Playwright is optional and only used if available
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        playwright: 'commonjs playwright',
      })
      
      // Ignore playwright module resolution warnings
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /playwright/ },
      ]
    }
    return config
  },
}

module.exports = nextConfig

