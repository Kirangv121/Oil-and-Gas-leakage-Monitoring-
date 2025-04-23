/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Set images to unoptimized mode
  images: {
    unoptimized: true,
  },
  // Disable SWC minification
  swcMinify: false,
  // Disable React strict mode for now
  reactStrictMode: false,
  // Allow importing .jsx files without specifying extension
  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx', '.json', '.ts', '.tsx', ...config.resolve.extensions];
    return config;
  },
}

export default nextConfig;
