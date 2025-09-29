// Purpose: verify the token on the SERVER and fetch the real user.
// This is the only trustworthy check that the session is valid.

// import { makeApiRequest } from './api';
// const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// // GET /auth/me — returns { user } if token is valid, 401 otherwise. 
// export async function fetchMe() {
//   return makeApiRequest<{ user: any }>(`${API}/auth/me`);
// }

import { makeApiRequest, API } from "./api";

export async function fetchMe() {
  return makeApiRequest<{ user: any }>(`${API}/auth/users/me`);
}
