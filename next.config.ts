import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' http://de-flaconi.frontastic.io.local https://de-flaconi.frontastic.io.local;",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Adjust this for your security needs
          },
        ],
      },
    ];
  },
};

export default nextConfig;
