"use client";

import { useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import { updateUser, SolutionPattern } from "../../lib/db";
import LoginView from "./LoginView";
import OverlayContent from "./OverlayContent";
import { Timestamp } from "firebase/firestore";
import LoadingScreen from "./components/LoadingScreen";


export default function MainView() {
  const { session, loading } = useSession();
  const [ownLoading, setOwnLoading] = useState<boolean>(true);

  console.log(session);

  useEffect(() => {
    
    const interval = setInterval(() => {
      setOwnLoading(false);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

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
    id: number;
    title: string;
    hint: string;
    length: number;
    pattern: SolutionPattern; 
  }[] = [
    {
      id: 1,
      title: "Level 1",
      hint: "8 Numbers",
      length: 8,
      pattern: "NUMBERS8"    },
    {
        id: 2,
      title: "Level 2",
      hint: "10 Number & Letters",
      length: 10,
      pattern: "NUMBERS/CHARS10",
    },
      {
        id: 3,
        title: "Level 3",
        hint: "12 Numbers",
        length: 12,
        pattern: "NUMBERS12"
      },
      {
        id: 4,
        title: "Level 4",
        hint: "16 Numbers & Letters",
        length: 16,
        pattern: "NUMBERS/CHARS16"
      },
    {
        id: 5,
      title: "Leaderboard",
      hint: "Here you can see everyone who is still trying or even suceeded",
      length: 20,
      pattern: "NUMBERS12" 
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
     <LoadingScreen /> 
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





