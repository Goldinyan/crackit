"use client";

type LevelTimerDisplayProps = {
  timeRemaining: number;
};

export default function LevelTimerDisplay({
  timeRemaining,
}: LevelTimerDisplayProps) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 w-90 md:w-120 lg:w-150 rounded-full bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 opacity-20 blur-xl animate-pulse-glow"></div>

        <div className="relative border-4 w-90 md:w-120 lg:w-150 border-neutral-600 rounded-full p-8 md:p-12 bg-neutral-800/50 backdrop-blur-sm">
          <div className="relative z-10  flex flex-col items-center justify-center min-w-[120px] md:min-w-[160px]">
            <div className="text-5xl flex items-center justify-center   md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 tabular-nums">
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-sm md:text-base text-neutral-400 uppercase tracking-wider mt-2">
              {timeRemaining > 60 ? "Minutes" : "Seconds"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg md:text-xl font-semibold text-white mb-2">
          Level is getting created.
        </p>
        <p className="text-[14px]  text-neutral-400">
          Please wait till the timer is finished.
        </p>
      </div>
    </div>
  );
}


