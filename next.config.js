/** @type {import('next').NextConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://xyphoria.vercel.app')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false
  },
  images: {
    domains: ['raw.githubusercontent.com', 'githubusercontent.com']
  },
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl
  }
}

module.exports = nextConfig
