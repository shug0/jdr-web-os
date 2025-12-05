import { z } from "zod";

// Base environment schema
export const baseEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// Supabase environment schema
export const supabaseEnvironmentSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

// AI environment schema
export const aiEnvironmentSchema = z.object({
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
});

// Notion environment schema
export const notionEnvironmentSchema = z.object({
  NOTION_TOKEN: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional(),
});

// Complete environment schema
export const environmentSchema = baseEnvironmentSchema
  .merge(supabaseEnvironmentSchema.partial())
  .merge(aiEnvironmentSchema.partial())
  .merge(notionEnvironmentSchema.partial());

// Validation helpers
export function validateEnvironment<T extends z.ZodType>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): z.infer<T> {
  const result = schema.safeParse(env);
  
  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.errors.forEach(error => {
      console.error(`  - ${error.path.join('.')}: ${error.message}`);
    });
    process.exit(1);
  }
  
  return result.data;
}

// Export types
export type BaseEnvironment = z.infer<typeof baseEnvironmentSchema>;
export type SupabaseEnvironment = z.infer<typeof supabaseEnvironmentSchema>;
export type AIEnvironment = z.infer<typeof aiEnvironmentSchema>;
export type NotionEnvironment = z.infer<typeof notionEnvironmentSchema>;
export type Environment = z.infer<typeof environmentSchema>;