import { z } from 'zod';

// Common API response structure
export const ApiResponseSchema = z.object({
  data: z.unknown().optional(),
  error: z.string().optional(),
  status: z.enum(['success', 'error']),
  message: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  status: 'success' | 'error';
  message?: string;
};

// API Client configuration
export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
}

// Request options
export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}