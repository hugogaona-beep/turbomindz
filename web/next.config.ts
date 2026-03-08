import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'nftstorage.link' },
      { protocol: 'https', hostname: 'i.seadn.io' },
      { protocol: 'https', hostname: 'openseauserdata.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/vault',       destination: '/dashboard/vault',     permanent: true },
      { source: '/marketplace', destination: '/marketplace/listings', permanent: false },
    ]
  },

  experimental: {
    typedRoutes: true,
  },

  webpack(config) {
    // Fix for wagmi/viem ESM modules
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
}

export default nextConfig
