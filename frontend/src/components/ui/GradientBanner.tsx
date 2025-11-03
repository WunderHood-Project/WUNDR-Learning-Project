// import * as React from "react";

// // mini-utility for classes
// const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

// type Props = {
//   title: React.ReactNode;
//   subtitle?: React.ReactNode;
//   cta?: React.ReactNode;                // pass buttons/links
//   size?: "sm" | "md" | "lg";            // size
//   align?: "center" | "left";            // content alignment
//   from?: string;                        // gradient start, tailwind class, e.g. 'from-wondergreen'
//   to?: string;                          // end of a gradient, e.g. 'to-wonderleaf'
//   showOrbs?: boolean;                   // turn circles on/off
//   className?: string;
//   contentClassName?: string;
// };

// export default function GradientBanner({
//   title,
//   subtitle,
//   cta,
//   size = "md",
//   align = "center",
//   from = "from-wondergreen",
//   to = "to-wonderleaf",
//   showOrbs = true,
//   className,
//   contentClassName,
// }: Props) {
//   const paddings = size === "lg" ? "py-16" : size === "sm" ? "py-8" : "py-12";
//   const titleSize = size === "lg" ? "text-4xl md:text-5xl" : size === "sm" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
//   const subSize   = size === "lg" ? "text-xl md:text-2xl"  : size === "sm" ? "text-base md:text-lg"  : "text-lg md:text-xl";
//   const alignCls  = align === "left" ? "text-left items-start" : "text-center items-center";

//   return (
//     <section
//       role="banner"
//       className={cn("relative bg-gradient-to-br text-white shadow-lg overflow-hidden", from, to, paddings, className)}
//     >
//       {/* decorative circles */}
//       {showOrbs && (
//         <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
//           <span className="absolute top-8 left-1/4 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute bottom-1/3 left-60 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
//           <span className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
//           <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
//           <span className="absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
//           <span className="absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
//           <span className="absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
//         </div>
//       )}

//       {/* content */}
//       <div className={cn("relative z-10", contentClassName)}>
//         <div className={cn("max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-4", alignCls)}>
//           <h1 className={cn("font-extrabold drop-shadow-lg", titleSize)}>{title}</h1>
//           {subtitle && (
//             <p className={cn("font-medium max-w-3xl", subSize, align === "left" ? "" : "mx-auto")}>{subtitle}</p>
//           )}
//           {cta && <div className={cn(align === "left" ? "" : "mx-auto")}>{cta}</div>}
//         </div>
//       </div>
//     </section>
//   );
// }
import * as React from "react";

// tiny classnames helper
const cn = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;                 // buttons/links
  size?: "sm" | "md" | "lg";             // overall scale
  align?: "center" | "left";             // text alignment
  from?: string;                         // tailwind: e.g. 'from-wondergreen'
  to?: string;                           // tailwind: e.g. 'to-wonderleaf'
  showOrbs?: boolean;                    // decorative circles
  className?: string;
  contentClassName?: string;
};

export default function GradientBanner({
  title,
  subtitle,
  cta,
  size = "md",
  align = "center",
  from = "from-wondergreen",
  to = "to-wonderleaf",
  showOrbs = true,
  className,
  contentClassName,
}: Props) {
  // Compact mobile → roomy on md+
  const paddings =
    size === "lg"
      ? "py-8 md:py-16"
      : size === "sm"
      ? "py-6 md:py-10"
      : "py-7 md:py-12";

  // Tighter mobile type scale + line-height
  const titleSize =
    size === "lg"
      ? "text-[32px] leading-tight md:text-5xl md:leading-tight"
      : size === "sm"
      ? "text-2xl leading-snug md:text-3xl md:leading-snug"
      : "text-[28px] leading-snug md:text-4xl md:leading-snug";

  const subSize =
    size === "lg"
      ? "text-base md:text-2xl"
      : size === "sm"
      ? "text-sm md:text-lg"
      : "text-[15px] md:text-xl";

  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <section
      role="banner"
      className={cn(
        "relative bg-gradient-to-br text-white shadow-lg overflow-hidden",
        from,
        to,
        paddings,
        className
      )}
    >
      {/* decorative circles (fewer on mobile) */}
      {showOrbs && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
          {/* === visible on mobile too (с анимацией) === */}
          <span
            className="absolute top-8 left-1/4 w-5 h-5 rounded-full bg-white/10
                      will-change-transform animate-float-slow motion-reduce:animate-none"
          />
          <span
            className="absolute bottom-1/3 left-1/2 w-4 h-4 rounded-full bg-white/10
                      will-change-transform animate-bounce-slow motion-reduce:animate-none"
          />
          {/* only from sm+ */}
          <span className="hidden sm:block absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="hidden sm:block absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="hidden sm:block absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
          <span className="hidden sm:block absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
          <span className="hidden sm:block absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="hidden sm:block absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
          <span className="hidden sm:block absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
          <span className="hidden sm:block absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="hidden sm:block absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
        </div>
      )}

      {/* content */}
      <div className={cn("relative z-10", contentClassName)}>
        <div className={cn("max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-3 md:gap-4", alignCls)}>
          <h1 className={cn("font-extrabold drop-shadow-lg tracking-tight", titleSize)}>{title}</h1>

          {subtitle && (
            <p
              className={cn(
                "font-medium text-white/95",
                // narrower paragraph on mobile for fewer lines
                "max-w-[36ch] sm:max-w-2xl",
                subSize,
                align === "left" ? "" : "mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}

          {cta && (
            <div className={cn("mt-1 md:mt-2", align === "left" ? "" : "mx-auto")}>
              {cta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
