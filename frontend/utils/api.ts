
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

if (typeof window !== 'undefined') {
    console.log('[API BASE]', BASE, 'NODE_ENV=', process.env.NODE_ENV);
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


// export const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// export const API = BASE;

// export function determineEnv() {
//     return BASE;
// }

// export interface ApiRequestOptions {
//     method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
//     body?: unknown
//     headers?: Record<string, string>;
//     token?: string;
// }


// export async function makeApiRequest<T>(
//     endpoint: string,
//     options: ApiRequestOptions = {}
// ): Promise<T> {

//     const {
//         method = "GET",
//         body,
//         headers = {},
//         token = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) ?? undefined,
//         // token = localStorage.getItem("token") ?? undefined,
//     } = options;

//     const finalHeaders: Record<string, string> = {
//         "Accept": "application/json",
//         ...headers,
//     };

//     // Set Content-Type only if there is actually a body
//     if (body !== undefined && body !== null && !finalHeaders["Content-Type"]) {
//         finalHeaders["Content-Type"] = "application/json";
//     }
//     if (token) finalHeaders.Authorization  = `Bearer ${token}`;

//     const url = endpoint.startsWith('http')
//     ? endpoint
//     : `${BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

//     const response = await fetch(url, {
//         method,
//         headers: finalHeaders,
//         body: body ? JSON.stringify(body) : undefined,
//     });

//     // Consider the response to be JSON only if the server says so.
//     const contentType = response.headers.get("content-type") || "";
//     const isJson = contentType.includes("application/json");

//     // Read the body once
//     let text = "";
//     try { text = await response.text(); } catch { /* empty body/network */ }

//     const parseJson = <U,>(t: string): U | {} => {
//         if (!t) return {};
//         try { return JSON.parse(t) as U; } catch { return {}; }
//     };

//     if (!response.ok) {
//     const errorData = isJson ? parseJson<{ detail?: string }>(text) as { detail?: string } : {};
//     const message = errorData.detail || response.statusText || "Request failed";

//     // 5xx — error
//     if (response.status >= 500) {
//       console.error("API 5xx", { url, status: response.status, errorData });
//     } else {
//       console.warn("API non-OK", { url, status: response.status, errorData });
//     }

//     throw new Error(`API Error ${response.status}: ${message}`);
//   }

//   // 204 / empty body - return an empty object (as it was in the patch)
//   if (!text) return {} as T;

//   // If the server didn't return JSON (rare, but it happens), we'll return it as is (as a string)
//   if (!isJson) return text as unknown as T;

//   // OK + JSON
//   return parseJson<T>(text) as T;

// }
