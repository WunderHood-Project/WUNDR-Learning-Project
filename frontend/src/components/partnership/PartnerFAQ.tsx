// export default function PartnerFAQ() {
//   const faqs = [
//     {
//       q: "Are you a 501(c)(3)?",
//       a: "Yes. Donations may be tax-deductible and we provide thank-you letters and impact summaries for your records.",
//     },
//     {
//       q: "Insurance & waivers?",
//       a: "We use parental consent waivers, follow venue safety requirements, and complete background checks for adult instructors and volunteers where required.",
//     },
//     {
//       q: "Can we sponsor a specific program?",
//       a: "Absolutely — you can support scholarships, gear, venue fees, transportation, or pilot programs.",
//     },
//     {
//       q: "How soon can we start?",
//       a: "We can usually pilot a partnership within 2-4 weeks after alignment, planning, and safety review.",
//     },
//   ];

//   return (
//     <section className="py-10 sm:py-12 lg:py-14">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Заголовок */}
//         <div className="flex flex-col items-center xl:items-start">
//           <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-wondergreen text-center xl:text-left">
//             FAQ
//           </h2>
//           <div className="h-1 w-3/4 sm:w-[6%] bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6 sm:mb-8 mt-2 self-center xl:self-start" />
//         </div>

//         {/* Сетка Q/A */}
//         <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
//           {faqs.map(({ q, a }) => (
//             <li
//               key={q}
//               className="
//                 group relative overflow-hidden rounded-2xl bg-white
//                 ring-1 ring-wonderleaf/20 shadow-sm
//                 transition-all duration-300 ease-out
//                 hover:shadow-xl motion-safe:hover:-translate-y-1.5
//               "
//             >
//               {/* Верхняя цветная полоска */}
//               <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-wondergreen via-wonderleaf to-wondersun" />

//               <div className="p-4 sm:p-5 lg:p-6">
//                 <h3
//                   className="
//                     font-semibold text-wondergreen
//                     text-[16px] sm:text-lg lg:text-[19px]
//                     flex items-start gap-2
//                   "
//                 >
//                   {/* маленький кружок-иконка */}
//                   <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-wondergreen/90 ring-2 ring-wonderleaf/30" />
//                   {q}
//                 </h3>

//                 <p
//                   className="
//                     text-gray-700 mt-2
//                     text-[15px] sm:text-base lg:text-[17px]
//                     leading-snug sm:leading-normal
//                   "
//                 >
//                   {a}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>

//         {/* CTA */}
//         <div className="text-center mt-8 sm:mt-10">
//           <a
//             href="#apply"
//             className="
//               inline-flex items-center rounded-full
//               bg-gradient-to-r from-wondergreen to-wonderleaf
//               px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold text-white
//               shadow-md hover:from-wonderleaf hover:to-wondergreen
//               transition-all duration-200 active:scale-95
//             "
//           >
//             Ready to partner? Send us a note →
//           </a>
//         </div>
//       </div>
//     </section>
//   );
//  }
