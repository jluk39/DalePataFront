/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
  // Configuración para deployment
  output: 'standalone',
  // Permitir imágenes de Supabase
  images: {
    unoptimized: true,
    domains: ['supabase.co'],
  },
}

export default nextConfig
