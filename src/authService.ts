import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { auth } from "./firebase";

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const result: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string
): Promise<User> {
  const result: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}