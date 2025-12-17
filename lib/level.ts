import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  query,
  where,
  limit,
  increment,
  Timestamp,
} from "firebase/firestore";
import type { Level, SolutionPattern } from "./types";
import { solutionPatterns } from "./types";

// Hilfsfunktionen zur Erstellung von Lösungen und Delays
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
    case "NUMBERS/CHARS16":
      future = new Date(now.getTime() + 15 * 60 * 1000);
      return Timestamp.fromDate(future);
    case "NUMBERS12":
      future = new Date(now.getTime() + 20 * 60 * 1000);
      return Timestamp.fromDate(future);
    default:
      return Timestamp.now();
  }
}

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


