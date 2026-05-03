import { db } from '@/lib/firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';

export type JobType = 'full-time' | 'part-time' | 'freelance' | 'internship' | 'contract';
export type JobKind = 'vacancy' | 'wanted'; // vacancy = biz posting, wanted = user seeking work

export interface Job {
  id: string;
  kind: JobKind;
  title: string;
  description: string;
  skills: string[];       // comma-split tags
  city: string;
  area: string;
  salary: string;         // e.g. "₹15,000–₹25,000/month"
  jobType: JobType;
  category: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  postedBy: string;       // uid
  postedByName: string;
  businessName?: string;
  businessSlug?: string;
  photoURL?: string;
  experience?: string;    // "0–1 yr", "2–5 yrs"
  education?: string;
  openings?: number;
  deadline?: string;      // ISO date string
  active: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const COL = 'jobs';

export async function createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateJob(id: string, data: Partial<Job>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function getJob(id: string): Promise<Job | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Job;
}

export async function getAllJobs(filters?: {
  city?: string;
  kind?: JobKind;
  category?: string;
  jobType?: JobType;
}): Promise<Job[]> {
  let q = query(collection(db, COL), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  let jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
  if (filters?.city)     jobs = jobs.filter(j => j.city?.toLowerCase() === filters.city!.toLowerCase());
  if (filters?.kind)     jobs = jobs.filter(j => j.kind === filters.kind);
  if (filters?.category) jobs = jobs.filter(j => j.category?.toLowerCase().includes(filters.category!.toLowerCase()));
  if (filters?.jobType)  jobs = jobs.filter(j => j.jobType === filters.jobType);
  return jobs;
}

export async function getUserJobs(uid: string): Promise<Job[]> {
  const q = query(collection(db, COL), where('postedBy', '==', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
}
