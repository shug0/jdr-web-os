import { fetchWithTimeout } from './fetch-with-timeout';
import type { ApiClientConfig, RequestOptions, ApiResponse } from './types';

/**
 * Standard API client for JDR Coffee monorepo
 * Provides consistent error handling, retries, and response formatting
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: '',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      retries: 1,
      ...config,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = this.config.baseUrl + endpoint;
    const requestOptions: RequestOptions = {
      timeout: this.config.timeout,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
      ...options,
    };

    let lastError: Error;
    const maxAttempts = (options.retries ?? this.config.retries) + 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetchWithTimeout(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
          status: 'success',
          data: data as T,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxAttempts) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
    }

    return {
      status: 'error',
      error: lastError!.message,
      message: `Request failed after ${maxAttempts} attempts`,
    };
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string, 
    data?: unknown, 
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string, 
    data?: unknown, 
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Factory function to create configured API clients
 */
export function createApiClient(config?: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}