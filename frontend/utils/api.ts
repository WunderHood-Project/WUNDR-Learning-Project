export const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export const API = BASE;

export function determineEnv() {
    return BASE;
    // let baseURL: string = ""

    // if (process.env.NODE_ENV === "production") {
    //     baseURL = process.env.NEXT_PUBLIC_API_URL || ""
    // }
    // baseURL = process.env.NEXT_PUBLIC_API_URL|| ""

    // return baseURL
}

export interface ApiRequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any
    headers?: Record<string, string>;
    token?: string;
}


export async function makeApiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {

    const {
        method = "GET",
        body,
        headers = {},
        token = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) ?? undefined,
        // token = localStorage.getItem("token") ?? undefined,
    } = options;

    const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

    const url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('erika look here', errorData)

        throw new Error(
            `API Error ${response.status}: ${errorData.detail || response.statusText}`
        );
    }

    return response.json();
}