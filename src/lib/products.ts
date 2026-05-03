import { db } from '@/lib/firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;          // raw string from OG / manual
  originalPrice?: string;
  imageUrl: string;
  sourceUrl: string;      // original product URL
  platform: string;       // 'Amazon', 'Flipkart', 'Meesho', etc.
  category: string;
  tags: string[];
  businessSlug: string;
  businessName: string;
  postedBy: string;       // uid
  city: string;
  inStock: boolean;
  active: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

const COL = 'products';

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    active: true,
    inStock: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getAllProducts(filters?: {
  category?: string;
  platform?: string;
  city?: string;
  businessSlug?: string;
  query?: string;
}): Promise<Product[]> {
  const q = query(collection(db, COL), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  let products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  const f = filters;
  if (f?.category)     products = products.filter(p => p.category?.toLowerCase().includes(f.category!.toLowerCase()));
  if (f?.platform)     products = products.filter(p => p.platform?.toLowerCase() === f.platform!.toLowerCase());
  if (f?.city)         products = products.filter(p => p.city?.toLowerCase() === f.city!.toLowerCase());
  if (f?.businessSlug) products = products.filter(p => p.businessSlug === f.businessSlug);
  if (f?.query) {
    const q2 = f.query.toLowerCase();
    products = products.filter(p =>
      p.title?.toLowerCase().includes(q2) ||
      p.description?.toLowerCase().includes(q2) ||
      p.tags?.some(t => t.toLowerCase().includes(q2))
    );
  }
  return products;
}

export async function getBusinessProducts(slug: string): Promise<Product[]> {
  const q = query(collection(db, COL), where('businessSlug', '==', slug), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
}

// Detect platform from URL
export function detectPlatform(url: string): string {
  if (url.includes('amazon'))   return 'Amazon';
  if (url.includes('flipkart')) return 'Flipkart';
  if (url.includes('meesho'))   return 'Meesho';
  if (url.includes('myntra'))   return 'Myntra';
  if (url.includes('nykaa'))    return 'Nykaa';
  if (url.includes('snapdeal')) return 'Snapdeal';
  if (url.includes('jiomart')) return 'JioMart';
  if (url.includes('ajio'))    return 'AJIO';
  if (url.includes('tatacliq')) return 'Tata Cliq';
  if (url.includes('indiamart')) return 'IndiaMart';
  return 'Online Store';
}
