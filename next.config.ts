import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000", // ✅ Allow localhost:9000 images
        pathname: "/static/**", // ✅ Allow all images under /static
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "sxnovikcvirmrnhtstsx.supabase.co",
        pathname: "/storage/v1/object/**",
      }
    ],
  },
};

export default nextConfig;
