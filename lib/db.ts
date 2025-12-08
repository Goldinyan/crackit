import { db } from "./firebase";
import {
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

type User = {
  username: string;
  email: string;
  backupEmail?: string;
  tries: number;
  won: number;
};

export async function getAllUserNames(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ ...doc.data() } as User));
}

export async function addUser(
    newUser: User
) {
    await setDoc(doc(db, "users", newUser.username), {
        username: newUser.username,
        email: newUser.email,
        backupEmail: newUser.backupEmail,
        tries: 0,
        won: 0
    })
}

export async function updateUser(username: string, updates: Partial<User>){
    try {
        const ref = doc(db, "users", username);
        await updateDoc(ref, updates);
      } catch (err) {
        console.error("Fehler beim Aktualisieren des Users:", err);
        throw err;
    }
}

export async function deleteUser(username: string){
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
