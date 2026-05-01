// src/lib/business.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function createBusiness(data: Record<string, unknown>) {
  const ref = collection(db, "businesses");
  return await addDoc(ref, { ...data, createdAt: serverTimestamp() });
}