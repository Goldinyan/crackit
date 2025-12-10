"use client";

import { useState, useEffect } from "react";
import { getAllUsers, User } from "../../lib/db";
import NavigationButton from "./components/NavigationButton";
import SectionHeader from "./components/SectionHeader";
import ErrorMessage from "./components/ErrorMessage";

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

export default function OverlayContent({
  current,
  onLeft,
  onRight,
  isTransitioning,
}: OverlayProps) {
  const [guess, setGuess] = useState<string[]>(() =>
    Array(current.length).fill("")
  );
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [lastFilledIndex, setLastFilledIndex] = useState<number>(-1);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };

    fetchUsers();
  }, []);

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

  if (current.title === "Leaderboard") {
    const sortedUsers = [...allUsers].sort((a, b) => {
      if (b.won !== a.won) return b.won - a.won;
      if (b.tries !== a.tries) return b.tries - a.tries;
      return a.username.localeCompare(b.username);
    });

    return (
      <div className="transition-all duration-300  items-center justify-center absolute inset-0 z-30 flex flex-col ">
        <div className="flex items-center  justify-between w-full ">
          <NavigationButton direction="left" onClick={onLeft} />

          <div>
            <SectionHeader
              label="Leaderboard"
              title="YYYYY"
              subtitle="XXXXXXXXXXX"
            />
            <div className="w-full mt-10 max-w-5xl bg-neutral-900/70 border border-gray-500/60 rounded-3xl p-4 md:p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.8)]">
              <div className="grid grid-cols-12 text-neutral-400 text-xs md:text-sm uppercase tracking-[0.15em] border-b border-neutral-700 pb-3 mb-4">
                <span className="col-span-2 text-center">Rank</span>
                <span className="col-span-5">User</span>
                <span className="col-span-2 text-center">Wins</span>
                <span className="col-span-2 text-center">Tries</span>
                <span className="col-span-1 text-center">Status</span>
              </div>

              <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto">
                {sortedUsers.length === 0 && (
                  <div className="text-center text-neutral-500 py-8">
                    No entries yet.
                  </div>
                )}
                {sortedUsers.map((user, idx) => (
                  <div
                    key={user.username}
                    className="grid grid-cols-12 h-16 justify-start w-full items-center rounded-2xl border border-neutral-800 bg-neutral-800/50 px-3 md:px-4  transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800/70"
                  >
                    <div className="col-span-2 flex items-center justify-start pl-10 text-lg font-bold text-white">
                      #{idx + 1}
                    </div>
                    <div className="col-span-5 flex flex-col">
                      <span className="text-white font-semibold">
                        {user.username}
                      </span>
                      {!user.online && (
                        <span className="text-neutral-400 text-xs">
                          last seen:{" "}
                          {user.lastSeen
                            ? user.lastSeen?.toDate().toLocaleDateString()
                            : "never"}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-center font-semibold">
                      {user.won}
                    </div>
                    <div className="col-span-2 text-center text-neutral-200">
                      {user.tries}
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <span
                        className={`h-3 w-3 ml-6 rounded-full ${
                          user.online
                            ? "bg-emerald-400 animate-pulse shadow-[0_0_0_6px_rgba(52,211,153,0.15)]"
                            : "bg-neutral-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NavigationButton direction="right" onClick={onRight} />
        </div>
      </div>
    );
  }
  return (
    <div className="transition-all duration-300 items-center justify-center  absolute inset-0 z-30 flex flex-col ">
      <div className="flex items-center justify-between w-full">
        <NavigationButton direction="left" onClick={onLeft} />

        <div className="mt-10">
          <SectionHeader
            label="Modus"
            title={current.title}
            subtitle={current.hint}
            isTransitioning={isTransitioning}
          />
          <div
            className={`border flex md:gap-10 md:p-10 p-4 gap-4 rounded-2xl border-gray-400 mt-10 transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {guess.map((g, i) => (
              <span
                key={`${current.title}-${i}`}
                className={`text-4xl font-extrabold text-white transition-all duration-200 ${
                  g === "" ? "opacity-30" : "opacity-100"
                } ${
                  lastFilledIndex === i ? "text-yellow-300 animate-pop" : ""
                }`}
              >
                {g === "" ? "_" : g}
              </span>
            ))}
          </div>
        </div>

        <NavigationButton direction="right" onClick={onRight} />
      </div>
      <ErrorMessage
        message={error}
        visible={errorVisible}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      />
    </div>
  );
}
