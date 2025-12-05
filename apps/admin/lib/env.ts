// Re-export environment utilities from shared package
export {
  getSupabaseUrl,
  getSupabaseServiceRoleKey,
  getSupabaseAnonKey,
  getSupabasePublicUrl,
  isDevelopment,
  isProduction,
  isTest,
  getOptionalEnvVar,
} from "@workspace/foundation/env";