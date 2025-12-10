"use client";

type ErrorMessageProps = {
  message: string;
  visible: boolean;
  className?: string;
};

export default function ErrorMessage({
  message,
  visible,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`text-red-400 text-sm font-medium transition-all duration-300 ${className} ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}

