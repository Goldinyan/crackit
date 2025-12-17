import { db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "./types";

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ ...doc.data() } as User));
}

export async function getUserData(username: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, "users", username));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as User;

  return {
    username: data.username,
    email: data.email,
    backupEmail: data.backupEmail,
    code: data.code,
    codeCreatedAt: data.codeCreatedAt,
    online: data.online,
    lastSeen: data.lastSeen,
    tries: data.tries,
    won: data.won,
    wonLevel: data.wonLevel,
  };
}

export async function doesUserExist(username: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "users", username));
  return snapshot.exists();
}

export async function addUser(newUser: User) {
  await setDoc(doc(db, "users", newUser.username), {
    username: newUser.username,
    email: newUser.email,
    backupEmail: newUser.backupEmail,
    code: "",
    codeCreatedAt: null,
    online: false,
    lastSeen: serverTimestamp(),
    tries: 0,
    won: 0,
  });
}

export async function updateUser(username: string, updates: Partial<User>) {
  try {
    const ref = doc(db, "users", username);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Users:", err);
    throw err;
  }
}

export async function deleteUser(username: string) {
  try {
    const ref = doc(db, "courses", username);
    const coursesSnapshot = await getDoc(ref);
    if (!coursesSnapshot.exists()) {
      console.log("No User to delete");
      return;
    }
    await deleteDoc(ref);
  } catch (err) {
    console.log(err);
  }
}


