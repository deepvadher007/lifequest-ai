/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better React hygiene
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Suppress specific harmless warnings in production
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Headers for security + performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff"          },
          { key: "X-Frame-Options",            value: "DENY"             },
          { key: "X-XSS-Protection",           value: "1; mode=block"   },
          { key: "Referrer-Policy",            value: "strict-origin"   },
        ],
      },
    ];
  },
};

export default nextConfig;
