import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 308 redirect del dominio viejo .shop al nuevo .com.ar
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rootslife.shop" }],
        destination: "https://www.rootslife.com.ar/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "rootslife.shop" }],
        destination: "https://www.rootslife.com.ar/:path*",
        permanent: true,
      },
      // Apex .com.ar también redirige al www (canonical = www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "rootslife.com.ar" }],
        destination: "https://www.rootslife.com.ar/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Forzar al browser a revalidar HTML cada vez (evita cache persistente)
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Assets estáticos (Next.js ya les aplica hash, pueden cachearse largo)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
