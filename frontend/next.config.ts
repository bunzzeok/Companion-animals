import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor mobile apps (disabled for development)
  // output: 'export',
  
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
  trailingSlash: false, // CORS 문제 해결을 위해 false로 변경
  
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
  
  // API 프록시 설정 (개발 환경에서만)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5001/api/:path*',
        },
      ];
    }
    return [];
  },

  // CORS 헤더 설정 (개발 환경에서만)
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'false' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS,PATCH' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          ],
        },
      ];
    }
    return [];
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
