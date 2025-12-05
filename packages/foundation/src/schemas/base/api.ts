import { z } from "zod";
import { MetaSchema } from "./common";

// Generic API response schema
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    meta: MetaSchema.optional(),
  });

// Error response schema
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  timestamp: z.string().datetime(),
});

// Success response schema
export const ApiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    meta: MetaSchema.optional(),
  });

// HTTP status codes
export const HttpStatusSchema = z.union([
  z.literal(200), // OK
  z.literal(201), // Created
  z.literal(400), // Bad Request
  z.literal(401), // Unauthorized
  z.literal(403), // Forbidden
  z.literal(404), // Not Found
  z.literal(500), // Internal Server Error
]);

// Request headers schema
export const RequestHeadersSchema = z.object({
  authorization: z.string().optional(),
  "content-type": z.string().optional(),
  "user-agent": z.string().optional(),
  "x-api-key": z.string().optional(),
});

// Export types
export type ApiResponse<T = unknown> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiSuccess<T = unknown> = z.infer<ReturnType<typeof ApiSuccessSchema<z.ZodType<T>>>>;
export type HttpStatus = z.infer<typeof HttpStatusSchema>;
export type RequestHeaders = z.infer<typeof RequestHeadersSchema>;