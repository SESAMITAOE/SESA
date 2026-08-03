import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins:[
        "localhost:3000",
        "127.0.0.1:3000",
        "https://dg19qzqf-3000.inc1.devtunnels.ms/"
      ],
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/sesa-logo.svg",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
