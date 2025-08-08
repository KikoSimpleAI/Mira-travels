/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'maps.googleapis.com'],
    unoptimized: true,
  },
  serverExternalPackages: ['firebase-admin'],
}

export default nextConfig
