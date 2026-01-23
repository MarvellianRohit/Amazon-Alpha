const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function apiClient<T>(
    endpoint: string,
    { params, ...options }: FetchOptions = {}
): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Attempt to parse error message
        let errorMessage = `API Error: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) errorMessage = errorData.detail;
            else if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
            // Ignore JSON parse error
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

/**
 * Helper to simulate delay during development/testing if needed
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
