"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

type NavigationButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
};

export default function NavigationButton({
  direction,
  onClick,
}: NavigationButtonProps) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  const marginClass =
    direction === "left"
      ? "ml-2 md:ml-6"
      : "mr-2 md:mr-6";

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full px-3 py-2 ${marginClass} md:px-6 md:py-4 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-105 active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)]`}
    >
      <Icon className="transition-transform duration-200 hover:scale-110" />
    </button>
  );
}

