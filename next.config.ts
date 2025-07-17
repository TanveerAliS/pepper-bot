import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
