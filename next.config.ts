import type { NextConfig } from "next";

// Homepage-only static site: no rewrites, no API proxy, no remote image hosts.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
