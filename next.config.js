/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.paperclip.co', 'api.paperclip.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.paperclip.co',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.paperclip.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
