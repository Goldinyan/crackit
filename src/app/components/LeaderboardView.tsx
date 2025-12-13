"use client";

import { useState } from "react";
import NavigationButton from "./NavigationButton";
import SectionHeader from "./SectionHeader";
import { User } from "../../../lib/db";
import UserView from "../UserView";

export default function LeaderboardView({
  onLeft,
  onRight,
  sortedUsers,
}: {
  onLeft: () => void;
  onRight: () => void;
  sortedUsers: User[];
}) {
  const [directUser, setDirectUser] = useState<User | null>(null);

  if (directUser !== null) {
    return (
      <div className="min-h-full w-full">
        <UserView user={directUser} goBack={() => setDirectUser(null)} />
      </div>
    );
  }

  return (
    <div className="transition-all duration-300  items-center justify-center absolute  inset-0 z-30 flex flex-col ">
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
                  onClick={() => setDirectUser(user)}
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
                      className={`h-3 w-3 ml-6 rounded-full ${user.online
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
