"use client";

import type { User, Level } from "../../lib/db";
import { useEffect, useState } from "react";
import { getAllLevels } from "../../lib/db";

type OtherUserProfileProps = {
  user: User;
};

export default function OtherUserProfile({ user }: OtherUserProfileProps) {
  return (
    <div className="border flex items-center justify-center flex-col p-6 w-[70%] md:w-[50%] rounded-2xl">
      <div className="flex items-center flex-col gap-2">
        <p className="font-extrabold text-2xl">{user.username}</p>
        {!user.online ? (
          <span className="text-neutral-400 text-[14px]">
            last seen:{" "}
            {user.lastSeen ? user.lastSeen?.toDate().toLocaleDateString() : "never"}
          </span>
        ) : (
          <div>
            <p className="text-emerald-400 text-[14px]">Online</p>
            <span
              className={`h-3 w-3 ml-6 rounded-full ${
                user.online
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_0_6px_rgba(52,211,153,0.15)]"
                  : "bg-neutral-500"
              }`}
            ></span>
          </div>
        )}
      </div>

      <div className="font-medium flex flex-col gap-2 pt-4">
        <p>{user.won}</p>
        <p>{user.tries}</p>
      </div>
      <div>
        <UserWonView user={user} />
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
        (entry) => entry.solution === user.username
      );
      setWonLevel(filteredLevel);
    };
    fetchWonLevel();
  }, [user]);

  return (
    <div>
      <div>
        {wonLevel.map((l) => (
          <div key={l.id}>
            <p>{l.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


