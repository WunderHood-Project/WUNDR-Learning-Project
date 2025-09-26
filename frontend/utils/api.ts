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
        token = localStorage.getItem("token") ?? undefined,
    } = options;

    const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

    const response = await fetch(endpoint, {
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


export const API = process.env.NEXT_PUBLIC_PRODUCTION ?? process.env.NEXT_PUBLIC_DEV;