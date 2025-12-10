"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSession } from "./SessionContext";
import { updateUser } from "../../lib/db";
import LoginView from "./LoginView";
import OverlayContent from "./OverlayContent";
import { Timestamp } from "firebase/firestore";


export default function MainView() {
  const allNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const { session, setSession, loading } = useSession();
  const [ownLoading, setOwnLoading] = useState<boolean>(true);
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  console.log(session);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setOwnLoading(false);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (session === null) return;

    // Online setzen beim Log in
    updateUser(session.user.username, {
      online: true,
      lastSeen: Timestamp.now() 
    });

    // Intervall für checken ob noch online
    const interval = setInterval(() => {
      updateUser(session.user.username, {
        online: true,
        lastSeen: Timestamp.now(),
      });
    }, 30000);

    // Event Listener wenn Tab schließen dann offline
    const handleUnload = () => {
      updateUser(session.user.username, {
        online: false,
        lastSeen: Timestamp.now(),
      });
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [session]);

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
      pattern: ["", ""],
    },
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

  if (ownLoading) {
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

  return (
    <div className="flex h-screen w-full bg-neutral-900 items-center justify-center">
      <div className="flex w-full items-center justify-center">
        {session == null ? (
          <LoginView />
        ) : (
          <OverlayContent
            current={current}
            onLeft={goLeft}
            onRight={goRight}
            isTransitioning={isTransitioning}
          />
        )}
      </div>
    </div>
  );
}





