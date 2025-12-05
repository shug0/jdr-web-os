import { createNextConfig } from "@workspace/foundation/config/next-config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = createNextConfig({
  typescript: {
    ignoreBuildErrors: false,
  },
});

export default nextConfig;