"use client";
import { useState, useEffect } from "react";
import { useSession } from "./SessionContext";
import LoadingScreen from "./components/LoadingScreen";
import { getAllLevels, User, Level } from "../../lib/db";
import { ArrowLeft } from "lucide-react";

export default function UserView({
  user,
  goBack,
}: {
  user: User;
  goBack: () => void;
}) {
  const { session, loading } = useSession();
  const isOwn = session?.user.email === user.email;

  if (loading) {
    return <LoadingScreen />;
  }

  if (isOwn) {
    return (
      <div className="w-full h-screen flex flex-col ">
        <div
          className="w-full h-full flex items-start justify-start "
          onClick={() => goBack()}
        >
          <ArrowLeft className="font-extrabold h-8 w-8 text-white m-10" />
        </div>
        <div className="w-full h-full">
          <OwnUser user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col ">
      <div
        className="absolute top-5 left-5 "
        onClick={() => goBack()}
      >
        <ArrowLeft className="font-extrabold h-8 w-8 text-white " />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <NotOwnUser user={user} />
      </div>
    </div>
  );
}

function OwnUser({ user }: { user: User }) {
  return (
    <div>
      <p>{user.username}</p>
    </div>
  );
}

function NotOwnUser({ user }: { user: User }) {
  return (
    <div className="border p-6 w-[70%] md:w-[50%] rounded-2xl">
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
