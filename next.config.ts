import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'user-cdn.hackclub-assets.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
