import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
      bodySizeLimit: "2mb",
    },
    optimizeCss: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply optimizations for production builds
    if (!dev) {
      if (!isServer) {
        // Client-side optimizations
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              default: false,
              vendors: false,
              commons: {
                name: "commons",
                chunks: "all",
                minChunks: 2,
                reuseExistingChunk: true,
              },
              vendor: {
                name: "vendor",
                chunks: "all",
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
              },
            },
          },
        };
      }
    }

    return config;
  },
};

export default nextConfig;
