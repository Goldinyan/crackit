"use client";

import { useState, useEffect } from "react";
import { addUser, getAllUsers, updateUser, deleteUser } from "../../lib/db";
import type { User } from "../../lib/db";
import { useSession } from "./SessionContext";

export default function LoginView() {
  const [userInfo, setUserInfo] = useState<User>({
    username: "",
    email: "",
    backupEmail: "",
    tries: 0,
    won: 0,
    online: true,
    lastSeen: new Date()
  });

  const [error, setError] = useState<string>("");
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const { session, setSession } = useSession();

  useEffect(() => {
    if(userInfo.username.length >= 5){
        setError("Username has to be more than 5 chars!");
        return;
    }

    const checkUsername = async () => {
      const users = await getAllUsers();
      if(users.filter((user) => user.username === userInfo.username)){
        setError("Username is already taken!");
        return;
      }
    };

    checkUsername();
  }, [userInfo.username]);

  const addingUser = async() => {
    if (userInfo.email === "") {
      setError("Email has to be set!");
      return;
    }
    if (userInfo.username === "") {
      setError("Username has to be set!");
      return;
    }

    if(error === ""){
        await addUser(userInfo);
        setSession({user: userInfo, loggedIn: true});
    }
  };

  return (<div></div>);
}
