import type { RequestOptions } from './types';

/**
 * Fetch with configurable timeout and abort controller
 * Extracted from apps/combien for shared use across the monorepo
 */
export async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestOptions = {},
): Promise<Response> {
  const { timeout = 15000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    
    throw error;
  }
}