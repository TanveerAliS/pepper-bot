import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
{
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' www.de-flaconi.frontastic.io.local/"
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless"
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin"
          }
        ]
      }
    ];
  },
};

export default nextConfig;
