"use client";

type GuessDisplayProps = {
  ownGuess: string[];
  currentTitle: string;
  lastFilledIndex: number;
  isTransitioning: boolean;
};

export default function GuessDisplay({
  ownGuess,
  currentTitle,
  lastFilledIndex,
  isTransitioning,
}: GuessDisplayProps) {
  return (
    <div
      className={`border flex md:gap-10 md:p-10 p-4 gap-4 rounded-2xl border-gray-400 mt-10 transition-all duration-500 ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {ownGuess.map((g, i) => (
        <span
          key={`${currentTitle}-${i}`}
          className={`text-4xl font-extrabold text-white transition-all duration-200 ${
            g === "" ? "opacity-30" : "opacity-100"
          } ${lastFilledIndex === i ? "text-yellow-300 animate-pop" : ""}`}
        >
          {g === "" ? "_" : g}
        </span>
      ))}
    </div>
  );
}


