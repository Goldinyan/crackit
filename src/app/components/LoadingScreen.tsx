"use client";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-900">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="mt-4 text-lg font-semibold text-blue-400 tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
