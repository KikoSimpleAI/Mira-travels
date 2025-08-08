/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'maps.googleapis.com',
      'maps.google.com',
      'lh3.googleusercontent.com',
      'places.googleapis.com'
    ],
    unoptimized: true,
  },
}

export default nextConfig
