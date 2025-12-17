"use client";

import { useState, useEffect } from "react";
import { addUser, doesUserExist } from "../../lib/db";
import type { User } from "../../lib/db";
import { useSession } from "./SessionContext";
import VerifyScreen from "./components/VerifyScreen";
import LoginForm from "./components/LoginForm";

export default function LoginView() {
  const [userInfo, setUserInfo] = useState<User>({
    username: "",
    email: "",
    code: null,
    codeCreatedAt: null,
    online: false,
    lastSeen: null,
    tries: 0,
    won: 0,
    wonLevel: []
  });

  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState<boolean>(false);
  const { session, setSession } = useSession();

  useEffect(() => {
    if (userInfo.username.length > 0 && userInfo.username.length < 5) {
      setError("Username has to be at least 5 characters!");
      setErrorVisible(true);
      return;
    }

    const checkUsername = async () => {
      if (userInfo.username.length >= 5) {
        const taken = await doesUserExist(userInfo.username);
        if (taken) {
          setError("Username is already taken!");
          setErrorVisible(true);
          return;
        }
        setError("");
        setErrorVisible(false);
      }
    };

    checkUsername();
  }, [userInfo.username]);

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorVisible(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field: keyof User, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value })); 
    setErrorVisible(false);
  };

  const addingUser = async () => {
    setIsLoading(true);

    if (userInfo.email === "") {
      setError("Email has to be set!");
      setErrorVisible(true);
      setIsLoading(false);
      return;
    }
    if (userInfo.username === "" || userInfo.username.length < 5) {
      setError("Username has to be at least 5 characters!");
      setErrorVisible(true);
      setIsLoading(false);
      return;
    }

    const taken = await doesUserExist(userInfo.username);
    if (taken) {
      setError("Username is already taken!");
      setErrorVisible(true);
      setIsLoading(false);
      return;
    }

    if (error === "") {
      try {
        await addUser(userInfo);
        setSession({ user: userInfo, loggedIn: true });
      } catch (err) {
        setError("Failed to create account. Please try again.");
        setErrorVisible(true);
      }
      console.log(isLoading);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addingUser();
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 items-center justify-center">
      <div className="flex items-center justify-center w-full px-4">
        <p onClick={() => setLogin(!login)}>Switch</p>
        {login ? (
          <LoginForm
            userInfo={userInfo}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            addingUser={addingUser}
            isLoading={isLoading}
            errorVisible={errorVisible}
            error={error}
          />
        ) : (
          <SignUp />
        )}
      </div>
    </div>
  );
}

function SignUp() {


  return (
    <div>
      <VerifyScreen />
    </div>
  )
}
