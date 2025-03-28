import { loading } from '../stores/loading';
export async function api(url, options = {}) {
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
            const error = new Error(data.error || 'An error occurred');
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data;
    }
    catch (error) {
        throw error;
    }
    finally {
        if (loadingKey) {
            loading.stopLoading(loadingKey);
        }
    }
}
export function createApiEndpoint(baseUrl) {
    return {
        get: (path, options) => api(`${baseUrl}${path}`, { ...options, method: 'GET' }),
        post: (path, data, options) => api(`${baseUrl}${path}`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        }),
        put: (path, data, options) => api(`${baseUrl}${path}`, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (path, options) => api(`${baseUrl}${path}`, { ...options, method: 'DELETE' }),
    };
}
//# sourceMappingURL=api.js.map