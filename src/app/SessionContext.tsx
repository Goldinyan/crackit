"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../../lib/db";

type Session = { user: User; loggedIn: boolean };

const SessionContext = createContext<{
  session: Session | null;
  setSession: (s: Session | null) => void;
  loading: boolean;
}>({ session: null, setSession: () => {}, loading: true });

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // setting state in local storage 
  const setSession = (s: Session | null) => {
    setSessionState(s);
    if (s) {
      localStorage.setItem("session", JSON.stringify(s));
    } else {
      localStorage.removeItem("session");
    }
  };

  // beim render aus local laden
  useEffect(() => {
    const raw = localStorage.getItem("session");
    if (raw) {
      try {
        setSessionState(JSON.parse(raw));
      } catch {
        localStorage.removeItem("session");
      }
    }
    setLoading(false);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}