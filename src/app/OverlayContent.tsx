"use client";

import { useState, useEffect } from "react";
import {
  getAllUsers,
  User,
  SolutionPattern,
  getCurrentLevel,
  updateUser,
  updateLevel,
  Level,
} from "../../lib/db";
import NavigationButton from "./components/NavigationButton";
import SectionHeader from "./components/SectionHeader";
import ErrorMessage from "./components/ErrorMessage";
import LeaderboardView from "./components/LeaderboardView";
import GuessDisplay from "./components/GuessDisplay";
import LevelTimerDisplay from "./components/LevelTimerDisplay";
import { Session, useSession } from "./SessionContext";
import LoadingScreen from "./components/LoadingScreen";
import { Timestamp } from "firebase/firestore";

type Mode = {
  id: number;
  title: string;
  hint: string;
  length: number;
  pattern: SolutionPattern;
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
  const [ownGuess, setOwnGuess] = useState<string[]>(() =>
    Array(current.length).fill("")
  );
  const [solution, setSolution] = useState<string[]>();
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [lastFilledIndex, setLastFilledIndex] = useState<number>(-1);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [level, setLevel] = useState<Level>();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { session } = useSession();

  useEffect(() => {
    const fetchCurrentSolution = async () => {
      const level = await getCurrentLevel(current.id.toString());
      setSolution(level.solution);
      setLevel(level);
    };

    fetchCurrentSolution();
  }, [current]);

  // Timer Logic
  useEffect(() => {
    if (!level?.delay) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const now = Timestamp.now();
      const delayTimestamp = level.delay!;

      //Firestore Timestamp zu milliseconds
      const nowMs = now.toMillis();
      const delayMs = delayTimestamp.toMillis();
      const remaining = Math.max(0, Math.floor((delayMs - nowMs) / 1000));

      setTimeRemaining(remaining);
    };

    updateTimer();

    // alle sekunde updaten
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [level?.delay]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setOwnGuess(Array(current.length).fill(""));
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
      const pattern: string[] = [];

      if (current.pattern === "NUMBERS8" || current.pattern === "NUMBERS12") {
        pattern.push("1", "2", "3", "4", "5", "6", "7", "8", "9", "0");
      } else {
        for (let i = 65; i <= 90; i++) {
          pattern.push(String.fromCharCode(i)); // A–Z
        }
      }

      updateError("");
      const key = e.key.toUpperCase();

      if (pattern.includes(key)) {
        setOwnGuess((prev) => {
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
      } else if (key !== "BACKSPACE") {
        updateError("Wrong Patter");
      }

      if (e.key === "Backspace") {
        setOwnGuess((prev) => {
          const next = [...prev];
          const idx = next.findLastIndex((c) => c !== "");
          if (idx !== -1) {
            next[idx] = "";
          }
          return next;
        });
      }

      if (!session) return;

      if (e.key === "Enter") {
        trySolution(session, current.id.toString(), ownGuess);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ownGuess, session, current]);

  if (current.title === "Leaderboard") {
    const sortedUsers = [...allUsers].sort((a, b) => {
      if (b.won !== a.won) return b.won - a.won;
      if (b.tries !== a.tries) return b.tries - a.tries;
      return a.username.localeCompare(b.username);
    });

    return (
      <LeaderboardView
        onRight={onRight}
        onLeft={onLeft}
        sortedUsers={sortedUsers}
      />
    );
  }

  if (level === undefined) {
    return <LoadingScreen />;
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
          <p className="text-center font-bold text-white">
            {solution ?? "NO SOLUTION"}
          </p>
          {level.delay === null || timeRemaining <= 0 ? (
            <GuessDisplay
              ownGuess={ownGuess}
              currentTitle={current.title}
              lastFilledIndex={lastFilledIndex}
              isTransitioning={isTransitioning}
            />
          ) : (
            <LevelTimerDisplay timeRemaining={timeRemaining} />
          )}
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

async function trySolution(session: Session, typeId: string, guess: string[]) {
  if (!session) {
    return;
  }
  await updateUser(session?.user.username, {
    tries: session?.user.tries + 1,
  });
  const level = await getCurrentLevel(typeId.toString());
  if (arraysEqual(guess, level.solution)) {
    updateUser(session.user.username, { won: session.user.won + 1 });
    updateLevel(typeId, level.id, { solver: session.user.username });
    console.log("Solved");
    window.location.reload();
    return;
  }
  console.log("Not Solved");
  console.log(level.solution + " !== " + guess);
}

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
