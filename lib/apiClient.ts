const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(method: HttpMethod, endpoint: string, body?: unknown): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isFormData = body instanceof FormData;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            // Don't set Content-Type for FormData — browser sets it with the correct multipart boundary
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        const detail = error.message ?? error.error ?? JSON.stringify(error);
        const err = new Error(detail) as Error & { status: number };
        err.status = res.status;
        throw err;
    }

    return res.json();
}

const apiClient = {
    get: <T>(endpoint: string) => request<T>("GET", endpoint),
    post: <T>(endpoint: string, body: unknown) => request<T>("POST", endpoint, body),
    put: <T>(endpoint: string, body: unknown) => request<T>("PUT", endpoint, body),
    patch: <T>(endpoint: string, body: unknown) => request<T>("PATCH", endpoint, body),
    delete: <T>(endpoint: string) => request<T>("DELETE", endpoint),
};

export default apiClient;
