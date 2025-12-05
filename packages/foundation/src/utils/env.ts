/**
 * Environment variable utilities for secure access to configuration
 */

/**
 * Safely get an environment variable with type checking
 * @param name - Environment variable name
 * @returns The environment variable value
 * @throws Error if the variable is not defined
 */
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Get an optional environment variable with fallback
 * @param name - Environment variable name
 * @param defaultValue - Default value if not defined
 * @returns The environment variable value or default
 */
export function getOptionalEnvVar(name: string, defaultValue: string = ""): string {
  return process.env[name] || defaultValue;
}

/**
 * Check if we're running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if we're running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if we're running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

// Supabase environment variables
export function getSupabaseUrl(): string {
  return getEnvVar("SUPABASE_URL");
}

export function getSupabaseServiceRoleKey(): string {
  return getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseAnonKey(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabasePublicUrl(): string {
  return getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
}

// AI/Gemini configuration
export function getGeminiApiKey(): string {
  return getEnvVar("GEMINI_API_KEY");
}

export function getOptionalGeminiApiKey(): string {
  const key = getOptionalEnvVar("GEMINI_API_KEY");
  if (!key && isDevelopment()) {
    console.warn("⚠️ ATTENTION: Clé API Gemini non définie. Veuillez définir la variable d'environnement GEMINI_API_KEY.");
  }
  return key;
}