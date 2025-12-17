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


