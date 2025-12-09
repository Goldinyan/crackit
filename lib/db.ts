import { db } from "./firebase";
import {
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type User = {
  username: string; // username ist id
  email: string;
  backupEmail?: string;
  code?: string;
  codeCreatedAt?: Date;
  online: boolean;
  lastSeen: Date;
  tries: number;
  won: number;
};

export type Level = {
  solution: string;
  tries: number;
  participants: Record<string, number>;
  solver: [string, number]; // username ist id
};

// LEVEL

export async function addLevel(level: string, solution: string): Promise<void> {
  const levelPrefix = "Level " + level;
  const levelNumber = "Level" + (await getAllLevelsOfLevel(level)).length;
  await setDoc(doc(db, levelPrefix, levelNumber), {
    solution: solution,
    tries: 0,
    participants: [],
    solver: [],
  });
}

export async function getAllLevelsOfLevel(level: string): Promise<Level[]> {
  const levelPrefix = "Level " + level;

  const snapshot = await getDocs(collection(db, levelPrefix));
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Level));
}

export async function getCurrentLevel(level: string): Promise<Level | null> {
  const levelPrefix = "Level" + level;
  const snapshot = await getDocs(collection(db, levelPrefix));
  const levels: Level[] = snapshot.docs.map((doc) => ({
    ...(doc.data() as Level),
  }));

  const firstWithoutSolver = levels.find((lvl) => !lvl.solver);

  return firstWithoutSolver ?? null;
}

//MARK: USER

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ ...doc.data() } as User));
}

export async function getUserData(username: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, "users", username));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();

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
  };
}



export async function addUser(newUser: User) {
  await setDoc(doc(db, "users", newUser.username), {
    username: newUser.username,
    email: newUser.email,
    backupEmail: newUser.backupEmail,
    code: "",
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

//MARK: LOGIN

type Session = { user: User; loggedIn: boolean };

export async function requestLoginCode(username: string): Promise<void> {
  const userRef = doc(db, "users", username);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) throw new Error("User not found");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await updateDoc(userRef, { loginCode: code, loginCodeCreatedAt: Date.now() });

  // await sendEmail(snap.data().email, `Your login code: ${code}`);
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
  updateUser(username, { code: undefined, codeCreatedAt: undefined });

  return {
    user: data,
    loggedIn: true,
  };
}
