"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MainView() {
  const allNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const modes: {
    title: string;
    hint: string;
    length: number;
    pattern: string[];
  }[] = [
    {
      title: "Level 1",
      hint: "8 Numbers",
      length: 8,
      pattern: [...allNumbers],
    },
    {
      title: "Level 2",
      hint: "10 Number & Letters",
      length: 10,
      pattern: [...allNumbers, ...allLetters],
    },
    {
        title: "Leaderboard",
        hint: "Here you can see everyone who is still trying or even suceeded",
        length: 20,
        pattern: ["", ""]   
    }
  ];

  const [modeIndex, setModeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const current = modes[modeIndex];

  const goLeft = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setModeIndex((prev) => (prev - 1 + modes.length) % modes.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goRight = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setModeIndex((prev) => (prev + 1) % modes.length);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 items-center justify-center">
      <div className="flex items-center justify-center">
        <OverlayContent 
          current={current} 
          onLeft={goLeft} 
          onRight={goRight}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  );
}

type Mode = {
  title: string;
  hint: string;
  length: number;
  pattern: string[];
};

type OverlayProps = {
  current: Mode;
  onLeft: () => void;
  onRight: () => void;
  isTransitioning: boolean;
};

type Errors = "Wrong Patter" | "To Much Chars" | "";

function OverlayContent({ current, onLeft, onRight, isTransitioning }: OverlayProps) {
  const [guess, setGuess] = useState<string[]>(() =>
    Array(current.length).fill("")
  );
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [lastFilledIndex, setLastFilledIndex] = useState<number>(-1);

  useEffect(() => {
    setGuess(Array(current.length).fill(""));
    setLastFilledIndex(-1);
  }, [current]);

  const updateError = (errorType: Errors) => {
    switch (errorType) {
      case "":
        setErrorVisible(false);
        
        break;
      case "To Much Chars":
        setError("You wanted to type too many Chars!");
        setErrorVisible(true);
        break;
      case "Wrong Patter":
        setError("Type only the designed Chars!");
        setErrorVisible(true);
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateError("");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      updateError("");
      const key = e.key.toUpperCase();

      if (current.pattern.includes(key)) {
        setGuess((prev) => {
          const next = [...prev];

          const idx = next.findIndex((c) => c === "");
          if (idx !== -1) {
            next[idx] = key;
            setLastFilledIndex(idx);
            setTimeout(() => setLastFilledIndex(-1), 300);
          } else {
            updateError("To Much Chars");
          }
          return next;
        });
      } else if (key !== "BACKSPACE" && key.length === 1) {
        updateError("Wrong Patter");
      }

      if (e.key === "Backspace") {
        setGuess((prev) => {
          const next = [...prev];
          const idx = next.findLastIndex((c) => c !== "");
          if (idx !== -1) {
            next[idx] = "";
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current]);

  return (
    <div className="transition-all duration-300 items-center justify-center  absolute inset-0 z-30 flex flex-col ">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={onLeft}
          className="cursor-pointer rounded-full px-3 py-2 ml-4 md:px-6 md:py-4 md:ml-10 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-105 active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)]"
        >
          <ArrowLeft className="transition-transform duration-200 hover:scale-110" />
        </button>

        <div className="text-center flex flex-col gap-2 mt-10">
          <p 
            className={`text-xl uppercase tracking-[0.2em] text-neutral-400 transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            Modus
          </p>
          <h2 
            className={`text-4xl font-semibold transition-all duration-300 ${
              isTransitioning ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            {current.title}
          </h2>
          <p 
            className={`text-xl text-neutral-400 transition-all duration-300 delay-75 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {current.hint}
          </p>
          <div 
            className={`border flex md:gap-10 md:p-10 p-4 gap-4 rounded-2xl border-gray-400 mt-10 transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {guess.map((g, i) => (
              <span
                key={`${current.title}-${i}`}
                className={`text-4xl font-extrabold text-white transition-all duration-200 ${
                  g === "" 
                    ? "opacity-30" 
                    : "opacity-100"
                } ${
                  lastFilledIndex === i
                    ? "text-yellow-300 animate-pop"
                    : ""
                }`}
              >
                {g === "" ? "_" : g}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onRight}
          className="cursor-pointer rounded-full px-3 py-2 mr-4 md:px-6 md:py-4 md:mr-10 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-105 active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)]"
        >
          <ArrowRight className="transition-transform duration-200 hover:scale-110" />
        </button>
      </div>
      <div 
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 text-red-400 text-sm font-medium transition-all duration-300 ${
          errorVisible 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {error}
      </div>
    </div>
  );
}
