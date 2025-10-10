// src/components/ui/GradientBanner.tsx
import * as React from "react";

// мини-утилита для классов
const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;                // сюда можно передать кнопки/ссылки
  size?: "sm" | "md" | "lg";            // размеры
  align?: "center" | "left";            // выравнивание контента
  from?: string;                        // начало градиента, tailwind-класс, напр. 'from-wondergreen'
  to?: string;                          // конец градиента, напр. 'to-wonderleaf'
  showOrbs?: boolean;                   // включить/выключить кружочки
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
  const paddings = size === "lg" ? "py-16" : size === "sm" ? "py-8" : "py-12";
  const titleSize = size === "lg" ? "text-4xl md:text-5xl" : size === "sm" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
  const subSize   = size === "lg" ? "text-xl md:text-2xl"  : size === "sm" ? "text-base md:text-lg"  : "text-lg md:text-xl";
  const alignCls  = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <section
      role="banner"
      className={cn("relative bg-gradient-to-br text-white shadow-lg overflow-hidden", from, to, paddings, className)}
    >
      {/* декоративные кружочки */}
      {showOrbs && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
          <span className="absolute top-8 left-1/4 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-1/3 left-60 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
          <span className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
          <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
          <span className="absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
          <span className="absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
        </div>
      )}

      {/* контент */}
      <div className={cn("relative z-10", contentClassName)}>
        <div className={cn("max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-4", alignCls)}>
          <h1 className={cn("font-extrabold drop-shadow-lg", titleSize)}>{title}</h1>
          {subtitle && (
            <p className={cn("font-medium max-w-3xl", subSize, align === "left" ? "" : "mx-auto")}>{subtitle}</p>
          )}
          {cta && <div className={cn(align === "left" ? "" : "mx-auto")}>{cta}</div>}
        </div>
      </div>
    </section>
  );
}
