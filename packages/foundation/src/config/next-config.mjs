/**
 * Shared Next.js configuration for JDR Coffee monorepo
 * Provides consistent base configuration across all apps
 */

/**
 * Base Next.js configuration shared across all apps
 * @type {import('next').NextConfig}
 */
export const baseNextConfig = {
  // Transpile workspace packages (updated for new architecture)
  transpilePackages: [
    "@workspace/foundation",
    "@workspace/ui",
    "@workspace/data",
    "@workspace/features",
  ],

  // Optimize images for production
  images: {
    unoptimized: true
  },

  // Build optimizations
  experimental: {
    // Enable modern bundling optimizations
    optimizePackageImports: ["lucide-react"],
  },

  // Allow dev cross-origin requests for .jdr.local domains (HTTPS with Caddy local_certs)
  allowedDevOrigins: [
    'https://jdr.local',
    'https://web.jdr.local',
    'https://combien.jdr.local',
    'https://pnj.jdr.local',
    'https://admin.jdr.local',
  ],
};

/**
 * Create Next.js config with custom overrides
 * @param {Partial<import('next').NextConfig>} overrides - Custom configuration overrides
 * @returns {import('next').NextConfig}
 */
export function createNextConfig(overrides = {}) {
  return {
    ...baseNextConfig,
    ...overrides,
    // Merge transpilePackages if both exist
    transpilePackages: [
      ...baseNextConfig.transpilePackages,
      ...(overrides.transpilePackages || []),
    ],
  };
}