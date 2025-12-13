"use client";
import { useState, useEffect } from "react";
import { useSession } from "./SessionContext";
import LoadingScreen from "./components/LoadingScreen";
import { getAllLevels, User, Level } from "../../lib/db";

export default function UserView({ user, goBack }: { user: User, goBack: () => void }) {
  const { session, setSession, loading } = useSession();
  const isOwn = session?.user === user;

  if (loading) {
    return <LoadingScreen />;
  }

  if (isOwn) {
    return <div></div>;
  }

  return <div></div>;
}

function NotOwnUser({ user }: { user: User }) {
  return (
    <div>
      <div>
        <p>{user.username}</p>
        {!user.online && (
          <span className="text-neutral-400 text-xs">
            last seen:{" "}
            {user.lastSeen
              ? user.lastSeen?.toDate().toLocaleDateString()
              : "never"}
          </span>
        )}
      </div>
      <div>
        <p>{user.won}</p>
        <p>{user.tries}</p>
      </div>
    </div>
  );
}

function UserWonView({ user }: { user: User }) {
  const [wonLevel, setWonLevel] = useState<Level[]>([]);

  useEffect(() => {
    const fetchWonLevel = async () => {
      const level = await getAllLevels();
      const filteredLevel = level.filter(
        (level) => level.solution === user.username,
      );
      setWonLevel(filteredLevel);
    };
    fetchWonLevel();
  }, [user]);
  return (
    <div>
      <div>
        {wonLevel.map((l) => (
          <div key={l.solution}>
            <p>{l.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
