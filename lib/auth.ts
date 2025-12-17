import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { sendVerificationCodePerEmail } from "./email";
import type { User } from "./types";
import { getUserData, updateUser } from "./user";

export type Session = { user: User; loggedIn: boolean };

export async function requestLoginCode(username: string): Promise<string> {
  const userRef = doc(db, "users", username);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) throw new Error("User not found");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = snapshot.data() as User;

  await updateDoc(userRef, {
    loginCode: code,
    loginCodeCreatedAt: Date.now(),
    code,
    codeCreatedAt: Date.now(),
  });

  sendVerificationCodePerEmail(user.email, username, code);
  return "";
}

export async function verifyLoginCode(
  username: string,
  code: string
): Promise<Session | null> {
  const data = await getUserData(username);
  if (data === null) return null;

  const storedCode = data.code;
  const createdAt = data.codeCreatedAt;

  // Time valid yk
  const isExpired = Date.now() - Number(createdAt) > 5 * 60 * 1000;
  if (isExpired) throw new Error("Code expired");
  if (storedCode !== code) throw new Error("Invalid code");

  // invalidate code when success
  await updateUser(username, { code: null, codeCreatedAt: null });

  return {
    user: data,
    loggedIn: true,
  };
}


