"use client";

type SectionHeaderProps = {
  label: string;
  title: string;
  subtitle?: string;
  isTransitioning?: boolean;
};

export default function SectionHeader({
  label,
  title,
  subtitle,
  isTransitioning = false,
}: SectionHeaderProps) {
  return (
    <div className="text-center flex flex-col gap-2">
      <p
        className={`text-xl uppercase tracking-[0.2em] text-neutral-400 transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
      >
        {label}
      </p>
      <h2
        className={`text-3xl md:text-4xl font-semibold text-white transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-sm md:text-base  text-neutral-400 transition-all duration-300 delay-75 ${
            isTransitioning
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

