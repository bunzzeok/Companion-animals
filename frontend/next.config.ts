import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor mobile apps
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      }
    ]
  },
  
  // Trailing slash for better mobile compatibility
  trailingSlash: true,
  
  // Disable server-side features for static export
  distDir: 'out',
  
  // Asset prefix for mobile apps
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Experimental features for mobile optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Webpack configuration for mobile builds
  webpack: (config, { dev, isServer }) => {
    // Mobile-specific optimizations
    if (!dev && !isServer) {
      // Minimize bundle size for mobile
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Mobile viewport optimizations - headers and rewrites don't work with static export
};

export default nextConfig;
