import { z } from "zod";

// Primitive schemas
export const IdSchema = z.string().uuid();
export const TimestampSchema = z.string().datetime();
export const EmailSchema = z.string().email();

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1, "Page must be at least 1"),
  limit: z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100"),
  offset: z.number().min(0, "Offset must be non-negative").optional(),
});

// Sort schema
export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]),
});

// Search schema
export const SearchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  filters: z.record(z.unknown()).optional(),
});

// Meta schema for API responses
export const MetaSchema = z.object({
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  pages: z.number().min(0),
});

// Base entity schema
export const BaseEntitySchema = z.object({
  id: IdSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Export types
export type Id = z.infer<typeof IdSchema>;
export type Timestamp = z.infer<typeof TimestampSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type BaseEntity = z.infer<typeof BaseEntitySchema>;