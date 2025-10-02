// // components/TestProtectedRoute.tsx
// "use client";
// import { makeApiRequest } from "../../../utils/api";

// export default function TestProtectedRoute() {
//   const testProtectedRoute = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const user = await makeApiRequest("http://localhost:8000/auth/users/me", {
//         method: "GET",
//         token: token!,
//       });
//       console.log("🔐 Current user:", user);
//     } catch (err) {
//       console.error("❌ Auth error:", err);
//     }
//   };

//   return <button onClick={testProtectedRoute}>Test Protected Route</button>;
// }
