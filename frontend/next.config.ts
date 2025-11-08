import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // More predictable configuration
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "history.nebraska.gov", pathname: "/**" },
      { protocol: "https", hostname: "visitwetmountainvalley.com", pathname: "/**" },
      { protocol: "https", hostname: "smalltownstops.com", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "www.clickvieweducation.com", pathname: "/**" },
      { protocol: "https", hostname: "cms.clickvieweducation.com", pathname: "/**" },
      { protocol: "http",  hostname: "localhost", port: "8000", pathname: "/**" },
      {protocol: "https",  hostname: "res.cloudinary.com", pathname: "/**",
      }, 
    ],
    // Small performance boost
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
    // (optional) fine-tuning sizes
    // deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    // imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
