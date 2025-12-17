"use client";
import { useState, useEffect } from "react";
import { useSession } from "./SessionContext";
import LoadingScreen from "./components/LoadingScreen";
import type { User } from "../../lib/db";
import { ArrowLeft } from "lucide-react";
import OtherUserProfile from "./components/OtherUserProfile";

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
      <div className="absolute top-5 left-5 " onClick={() => goBack()}>
        <ArrowLeft className="font-extrabold h-8 w-8 text-white " />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <OtherUserProfile user={user} />
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

