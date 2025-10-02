// "use client";

// import { handleSignup, SignupPayload } from "../../../utils/auth";

// export default function TestSignup() {
//   const testPayload: SignupPayload = {
//     firstName: "Blaidd",
//     lastName: "String",
//     email: `asdfasdfasdfasdfasd`, // Unique email for each test
//     password: "SecurePass123!",
//     role: "parent",
//     avatar: "https://example.com/avatar.png",
//     city: "Devine",
//     state: "TX",
//     zipCode: 78016,
//     children: [
//       {
//         firstName: "Ciaran",
//         lastName: "String",
//         homeschool: false,
//         birthday: new Date("2014-03-12").toISOString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//       {
//         firstName: "Artorias",
//         lastName: "String",
//         homeschool: true,
//         birthday: new Date("2016-11-05").toISOString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ],
//   };

//   console.log("HERE IS THE PAYLOAD", testPayload);

//   const onSignup = async () => {
//     try {
//       const response = await handleSignup(testPayload);
//       console.log("🆕 Signup response:", response);
//     } catch (err) {
//       console.error("❌ Signup error:", err);
//     }
//   };

//   return <button onClick={onSignup}>Test Signup</button>;
// }
