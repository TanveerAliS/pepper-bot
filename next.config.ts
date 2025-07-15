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
              "frame-src 'self' https://pepper-ofkzig7d8-tanveeralims-projects.vercel.app; frame-ancestors *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
