import { loading } from '../stores/loading';

interface ApiOptions extends RequestInit {
  loadingKey?: string;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

export async function api<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { loadingKey, ...fetchOptions } = options;

  if (loadingKey) {
    loading.startLoading(loadingKey);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'An error occurred') as ApiError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data as T;
  } catch (error) {
    throw error;
  } finally {
    if (loadingKey) {
      loading.stopLoading(loadingKey);
    }
  }
}

export function createApiEndpoint(baseUrl: string) {
  return {
    get: <T>(path: string, options?: ApiOptions) => 
      api<T>(`${baseUrl}${path}`, { ...options, method: 'GET' }),
    
    post: <T>(path: string, data: any, options?: ApiOptions) =>
      api<T>(`${baseUrl}${path}`, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    put: <T>(path: string, data: any, options?: ApiOptions) =>
      api<T>(`${baseUrl}${path}`, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: <T>(path: string, options?: ApiOptions) =>
      api<T>(`${baseUrl}${path}`, { ...options, method: 'DELETE' }),
  };
}
