import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://dashboard.intell.ng/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://dashboard.intell.ng",
        permanent: true,
      },
      {
        source: "/installer/:path*",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://installer.intell.ng/:path*",
        permanent: true,
      },
      {
        source: "/installer",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://installer.intell.ng",
        permanent: true,
      },
      {
        source: "/super-admin/:path*",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://admin.intell.ng/:path*",
        permanent: true,
      },
      {
        source: "/super-admin",
        has: [{ type: "host", value: "intell.ng" }],
        destination: "https://admin.intell.ng",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
