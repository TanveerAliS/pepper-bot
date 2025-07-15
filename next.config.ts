import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Remove or set to ALLOWALL to permit embedding
          },
        ],
      },
    ];
  },
};

export default nextConfig;
