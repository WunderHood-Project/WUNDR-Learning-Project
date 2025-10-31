import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // More predictable configuration
    remotePatterns: [
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Articles / blog (example)
      {
        protocol: "https",
        hostname: "history.nebraska.gov",
        pathname: "/**",
      },
      // Local tourism site
      {
        protocol: "https",
        hostname: "visitwetmountainvalley.com",
        pathname: "/**",
      },
      // Cloudinary (allow all subdomains)
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
      // Dev scenario (if absolute URLs from local backend are used)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // <- set your port if different
        pathname: "/**",
      },
      // WordPress host used in event images
      {
        protocol: "https",
        hostname: "smalltownstops.com",
        pathname: "/wp-content/**",
      },
      // ClickView 
      {
        protocol: "https",
        hostname: "www.clickvieweducation.com",
        pathname: "/**",
      },
      // ClickView CMS
      {
        protocol: "https",
        hostname: "cms.clickvieweducation.com",
        pathname: "/**",
      },
      // If you also need 127.0.0.1:
      // { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
    ],
    // Small performance boost
    formats: ["image/avif", "image/webp"],
    // (optional) fine-tuning sizes
    // deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    // imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
