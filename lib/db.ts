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
  runTransaction,
  query,
  where,
  limit,
} from "firebase/firestore";
import { increment } from "firebase/firestore";
import { sendVerificationCodePerEmail } from "./email";
import { Timestamp, FieldValue } from "firebase/firestore";

export type User = {
  username: string; // username ist id
  email: string;
  backupEmail?: string;
  code: string | null;
  codeCreatedAt: number | null;
  online: boolean;
  lastSeen: Timestamp | FieldValue | null;
  tries: number;
  won: number;
  wonLevel: string[];
};

export type Level = {
  id: string;
  solution: string[];
  tries: number;
  participants: Record<string, number>;
  solver: string | null; // username ist id
  delay: Timestamp | null;
};

export const solutionPatterns = [
  "NUMBERS8",
  "NUMBERS/CHARS10",
  "NUMBERS12",
  "NUMBERS/CHARS16",
] as const;

export type SolutionPattern = (typeof solutionPatterns)[number];

// SOLUTION CREATION

function createSolution(solutionPattern: SolutionPattern): string[] {
  const password: string[] = [];
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  switch (solutionPattern) {
    case "NUMBERS8":
      for (let i = 0; i < 8; i++) {
        password.push(Math.floor(Math.random() * 10).toString());
      }
      break;
    case "NUMBERS12":
      for (let i = 0; i < 12; i++) {
        password.push(Math.floor(Math.random() * 10).toString());
      }
      break;
    case "NUMBERS/CHARS10":
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password.push(chars[randomIndex]);
      }
    case "NUMBERS/CHARS16":
      for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password.push(chars[randomIndex]);
      }
  }

  return password;
}

function getDelayTime(solutionPattern: SolutionPattern): Timestamp {
  let future: Date;
  const now: Date = new Date();

  switch (solutionPattern) {
    case "NUMBERS/CHARS10":
      future = new Date(now.getTime() + 5 * 60 * 1000);
      return Timestamp.fromDate(future);
    case "NUMBERS8":
      future = new Date(now.getTime() + 10 * 60 * 1000);
      return Timestamp.fromDate(future);
      break;
    case "NUMBERS/CHARS16":
      future = new Date(now.getTime() + 15 * 60 * 1000);
      return Timestamp.fromDate(future);
      break;
    case "NUMBERS12":
      future = new Date(now.getTime() + 20 * 60 * 1000);
      return Timestamp.fromDate(future);
      break;
    default:
      return Timestamp.now();
  }
}

// LEVEL

export async function updateLevel(
  typeId: string,
  id: string,
  updates: Partial<Level>
) {
  try {
    const ref = doc(db, "levels", typeId, "entries", id);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error("Fehler beim Aktualisieren von einem Level", err);
    throw err;
  }
}

export async function addLevel(
  typeId: string,
  solutionPattern: SolutionPattern
): Promise<Level> {
  const delay: Timestamp = getDelayTime(solutionPattern);

  const counterRef = doc(db, "levelCounters", typeId);
  const counterSnap = await getDoc(counterRef);

  console.log(counterSnap.data()?.value);

  // hochzählen
  await setDoc(counterRef, { value: increment(1) }, { merge: true });

  // Den aktuellen Wert zurücklesen
  const levelNumber = Number(counterSnap.data()?.value);

  console.log(levelNumber);

  const level: Level = {
    id: levelNumber.toString(),
    solution: createSolution(solutionPattern),
    tries: 0,
    participants: {},
    solver: null,
    delay,
  };

  const ref = doc(db, "levels", typeId, "entries", level.id);
  await setDoc(ref, level);

  return level;
}

export async function getAllLevelsOfType(level: string): Promise<Level[]> {
  const snapshot = await getDocs(collection(db, "levels", level, "entries"));
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Level));
}

export async function getAllLevels(): Promise<Level[]> {
  const allLevels: Level[] = [];

  for (const num of ["1", "2", "3", "4"]) {
    const levels = await getAllLevelsOfType(num);
    allLevels.push(...levels);
  }

  return allLevels;
}

export async function getCurrentLevel(level: string): Promise<Level> {
  const levelCollection = collection(db, "levels", level, "entries");
  const snapshot = await getDocs(
    query(levelCollection, where("solver", "==", null), limit(1))
  );

  if (!snapshot.empty) {
    return snapshot.docs[0].data() as Level;
  }

  const newLevel = await addLevel(level, solutionPatterns[Number(level)]);
  return newLevel;
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

//MARK: LOGIN

type Session = { user: User; loggedIn: boolean };

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
  console.log(data);
  console.log(storedCode);
  console.log(code);
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
