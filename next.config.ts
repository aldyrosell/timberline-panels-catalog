import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The published URLs already have trailing slashes. Changing this creates a
  // second URL for every page and splits their ranking signals.
  trailingSlash: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
