import { db } from './firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore';

export interface Job {
  id: string;
  type: 'vacancy' | 'wanted';
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: 'hourly' | 'monthly' | 'yearly' | 'negotiable';
  location: string;
  city: string;
  area?: string;
  workType?: 'remote' | 'onsite' | 'hybrid';
  workSchedule?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experience?: string;
  experienceMin?: number;
  experienceMax?: number;
  skills: string[];
  category: string;
  // For vacancies
  company?: string;
  companySize?: string;
  companyWebsite?: string;
  // For job wanted
  userName?: string;
  userProfile?: string;
  // Common
  postedBy: string;
  postedByRole: 'user' | 'business';
  businessSlug?: string;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'active' | 'closed' | 'filled' | 'expired';
  views: number;
  applications: number;
  featured: boolean;
  urgent: boolean;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COL = 'jobs';

// Create a new job posting
export async function createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'applications'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    views: 0,
    applications: 0,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// Update job posting
export async function updateJob(id: string, data: Partial<Job>): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete job posting
export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// Get job by ID
export async function getJob(id: string): Promise<Job | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Job;
}

// Get all jobs with filters
export async function getAllJobs(filters?: {
  type?: 'vacancy' | 'wanted';
  category?: string;
  city?: string;
  workType?: 'remote' | 'onsite' | 'hybrid';
  workSchedule?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  postedBy?: string;
  businessSlug?: string;
  status?: 'active' | 'closed' | 'filled' | 'expired';
  featured?: boolean;
  urgent?: boolean;
  query?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  experienceMax?: number;
}): Promise<Job[]> {
  let q = query(collection(db, COL), orderBy('createdAt', 'desc'));

  const snap = await getDocs(q);
  let jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));

  const f = filters;
  if (f?.type) jobs = jobs.filter(j => j.type === f.type);
  if (f?.category) jobs = jobs.filter(j => j.category?.toLowerCase().includes(f.category!.toLowerCase()));
  if (f?.city) jobs = jobs.filter(j => j.city?.toLowerCase() === f.city!.toLowerCase());
  if (f?.workType) jobs = jobs.filter(j => j.workType === f.workType);
  if (f?.workSchedule) jobs = jobs.filter(j => j.workSchedule === f.workSchedule);
  if (f?.postedBy) jobs = jobs.filter(j => j.postedBy === f.postedBy);
  if (f?.businessSlug) jobs = jobs.filter(j => j.businessSlug === f.businessSlug);
  if (f?.status) jobs = jobs.filter(j => j.status === f.status);
  if (f?.featured) jobs = jobs.filter(j => j.featured === f.featured);
  if (f?.urgent) jobs = jobs.filter(j => j.urgent === f.urgent);
  if (f?.salaryMin) jobs = jobs.filter(j => {
    if (!j.salaryMin) return false;
    return j.salaryMin >= f.salaryMin!;
  });
  if (f?.salaryMax) jobs = jobs.filter(j => {
    if (!j.salaryMax) return false;
    return j.salaryMax <= f.salaryMax!;
  });
  if (f?.experienceMin) jobs = jobs.filter(j => {
    if (!j.experienceMin) return false;
    return j.experienceMin >= f.experienceMin!;
  });
  if (f?.experienceMax) jobs = jobs.filter(j => {
    if (!j.experienceMax) return false;
    return j.experienceMax <= f.experienceMax!;
  });
  if (f?.query) {
    const q2 = f.query.toLowerCase();
    jobs = jobs.filter(j =>
      j.title?.toLowerCase().includes(q2) ||
      j.description?.toLowerCase().includes(q2) ||
      j.skills?.some(s => s.toLowerCase().includes(q2)) ||
      j.company?.toLowerCase().includes(q2) ||
      j.userName?.toLowerCase().includes(q2)
    );
  }

  // Filter out expired jobs
  const now = new Date();
  jobs = jobs.filter(j => {
    if (!j.expiresAt) return true;
    const expiresAt = new Date(j.expiresAt.seconds * 1000);
    return expiresAt > now;
  });

  return jobs;
}

// Get jobs posted by a user
export async function getUserJobs(userId: string): Promise<Job[]> {
  const q = query(
    collection(db, COL),
    where('postedBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
}

// Get jobs for a business
export async function getBusinessJobs(businessSlug: string): Promise<Job[]> {
  const q = query(
    collection(db, COL),
    where('businessSlug', '==', businessSlug),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));
}

// Increment job views
export async function incrementJobViews(jobId: string): Promise<void> {
  await updateDoc(doc(db, COL, jobId), {
    views: (await getDoc(doc(db, COL, jobId))).data()?.views + 1 || 1,
  });
}

// Increment job applications
export async function incrementJobApplications(jobId: string): Promise<void> {
  await updateDoc(doc(db, COL, jobId), {
    applications: (await getDoc(doc(db, COL, jobId))).data()?.applications + 1 || 1,
  });
}

// Close job posting
export async function closeJob(jobId: string, reason: 'filled' | 'expired' | 'closed' = 'closed'): Promise<void> {
  await updateDoc(doc(db, COL, jobId), {
    status: reason,
    updatedAt: serverTimestamp(),
  });
}

// Feature job posting
export async function featureJob(jobId: string, featured: boolean = true): Promise<void> {
  await updateDoc(doc(db, COL, jobId), {
    featured,
    updatedAt: serverTimestamp(),
  });
}

// Mark job as urgent
export async function markJobUrgent(jobId: string, urgent: boolean = true): Promise<void> {
  await updateDoc(doc(db, COL, jobId), {
    urgent,
    updatedAt: serverTimestamp(),
  });
}

// Set job expiration
export async function setJobExpiration(jobId: string, days: number): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  await updateDoc(doc(db, COL, jobId), {
    expiresAt: expiresAt,
    updatedAt: serverTimestamp(),
  });
}

// Get job categories
export function getJobCategories(): string[] {
  return [
    'Technology',
    'Design',
    'Marketing',
    'Sales',
    'Customer Service',
    'Finance',
    'Human Resources',
    'Operations',
    'Legal',
    'Healthcare',
    'Education',
    'Engineering',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Construction',
    'Transportation',
    'Agriculture',
    'Media',
    'Consulting',
    'Other',
  ];
}

// Get job statistics
export async function getJobStatistics(): Promise<{
  total: number;
  vacancies: number;
  wanted: number;
  active: number;
  closed: number;
  byCategory: Record<string, number>;
  byCity: Record<string, number>;
}> {
  const snap = await getDocs(collection(db, COL));
  const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Job));

  const stats = {
    total: jobs.length,
    vacancies: jobs.filter(j => j.type === 'vacancy').length,
    wanted: jobs.filter(j => j.type === 'wanted').length,
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status !== 'active').length,
    byCategory: {} as Record<string, number>,
    byCity: {} as Record<string, number>,
  };

  jobs.forEach(job => {
    if (job.category) {
      stats.byCategory[job.category] = (stats.byCategory[job.category] || 0) + 1;
    }
    if (job.city) {
      stats.byCity[job.city] = (stats.byCity[job.city] || 0) + 1;
    }
  });

  return stats;
}

// Search jobs with advanced filters
export async function searchJobs(searchParams: {
  query?: string;
  type?: 'vacancy' | 'wanted';
  category?: string;
  city?: string;
  workType?: 'remote' | 'onsite' | 'hybrid';
  workSchedule?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  skills?: string[];
  featured?: boolean;
  urgent?: boolean;
}): Promise<Job[]> {
  return getAllJobs(searchParams);
}

// Get recommended jobs for a user based on their profile
export async function getRecommendedJobs(userId: string, limit: number = 10): Promise<Job[]> {
  try {
    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return [];

    const userData = userDoc.data();
    const userSkills = userData.skills || [];
    const userCity = userData.city || '';
    const userExperience = userData.experience || '';

    // Get all active jobs
    const allJobs = await getAllJobs({ status: 'active' });

    // Score jobs based on relevance
    const scoredJobs = allJobs.map(job => {
      let score = 0;

      // Match skills
      if (job.skills && userSkills.length > 0) {
        const matchingSkills = job.skills.filter(skill =>
          userSkills.some(userSkill =>
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        score += matchingSkills.length * 10;
      }

      // Match city
      if (job.city && userCity && job.city.toLowerCase() === userCity.toLowerCase()) {
        score += 5;
      }

      // Match experience level
      if (job.experience && userExperience) {
        const expMatch = job.experience.toLowerCase().includes(userExperience.toLowerCase()) ||
                        userExperience.toLowerCase().includes(job.experience.toLowerCase());
        if (expMatch) score += 3;
      }

      // Boost featured and urgent jobs
      if (job.featured) score += 2;
      if (job.urgent) score += 1;

      return { job, score };
    });

    // Sort by score and return top results
    return scoredJobs
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.job);
  } catch (error) {
    console.error('Error getting recommended jobs:', error);
    return [];
  }
}

// Get similar jobs
export async function getSimilarJobs(jobId: string, limit: number = 5): Promise<Job[]> {
  try {
    const job = await getJob(jobId);
    if (!job) return [];

    const similarJobs = await getAllJobs({
      category: job.category,
      city: job.city,
      type: job.type,
    });

    // Exclude the current job
    return similarJobs
      .filter(j => j.id !== jobId)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting similar jobs:', error);
    return [];
  }
}