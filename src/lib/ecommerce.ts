import { db } from './firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface EcommerceProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  images: string[];
  sourceUrl: string;
  platform: string;
  platformLogo?: string;
  category: string;
  tags: string[];
  brand?: string;
  model?: string;
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  stockCount?: number;
  variants?: Array<{
    name: string;
    value: string;
    price?: number;
    available: boolean;
  }>;
  businessSlug: string;
  businessName: string;
  postedBy: string;
  city: string;
  featured: boolean;
  active: boolean;
  views: number;
  clicks: number;
  affiliateLink?: string;
  commissionRate?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PlatformProduct {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  images: string[];
  sourceUrl: string;
  platform: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  inStock: boolean;
}

const COL = 'ecommerce_products';

// Platform detection and metadata
export const PLATFORMS = {
  amazon: {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    baseUrl: 'https://www.amazon.in',
    color: '#FF9900',
  },
  flipkart: {
    name: 'Flipkart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Flipkart_logo.png',
    baseUrl: 'https://www.flipkart.com',
    color: '#2874F0',
  },
  meesho: {
    name: 'Meesho',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Meesho_Logo.png',
    baseUrl: 'https://www.meesho.com',
    color: '#F43397',
  },
  myntra: {
    name: 'Myntra',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Myntra_logo.png',
    baseUrl: 'https://www.myntra.com',
    color: '#FF3F6C',
  },
  nykaa: {
    name: 'Nykaa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Nykaa_logo.png',
    baseUrl: 'https://www.nykaa.com',
    color: '#E91E63',
  },
  ajio: {
    name: 'AJIO',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/AJIO_logo.png',
    baseUrl: 'https://www.ajio.com',
    color: '#000000',
  },
  snapdeal: {
    name: 'Snapdeal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Snapdeal_logo.png',
    baseUrl: 'https://www.snapdeal.com',
    color: '#E40046',
  },
  jiomart: {
    name: 'JioMart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/JioMart_logo.png',
    baseUrl: 'https://www.jiomart.com',
    color: '#00AEEF',
  },
};

// Detect platform from URL
export function detectPlatform(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('amazon')) return 'amazon';
  if (lowerUrl.includes('flipkart')) return 'flipkart';
  if (lowerUrl.includes('meesho')) return 'meesho';
  if (lowerUrl.includes('myntra')) return 'myntra';
  if (lowerUrl.includes('nykaa')) return 'nykaa';
  if (lowerUrl.includes('snapdeal')) return 'snapdeal';
  if (lowerUrl.includes('jiomart')) return 'jiomart';
  if (lowerUrl.includes('ajio')) return 'ajio';
  return 'other';
}

// Fetch product details from URL (simulated - in production would use actual APIs)
export async function fetchProductFromUrl(url: string): Promise<PlatformProduct | null> {
  try {
    const platform = detectPlatform(url);

    // In production, this would make actual API calls to the platforms
    // For now, we'll return a simulated response
    const simulatedProduct: PlatformProduct = {
      title: 'Product Name (would be fetched from platform)',
      description: 'Product description would be fetched from the platform',
      price: 999,
      originalPrice: 1499,
      currency: 'INR',
      imageUrl: 'https://via.placeholder.com/400x400',
      images: ['https://via.placeholder.com/400x400'],
      sourceUrl: url,
      platform: PLATFORMS[platform as keyof typeof PLATFORMS]?.name || 'Other',
      category: 'General',
      inStock: true,
    };

    return simulatedProduct;
  } catch (error) {
    console.error('Error fetching product from URL:', error);
    return null;
  }
}

// Create ecommerce product
export async function createEcommerceProduct(data: Omit<EcommerceProduct, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    views: 0,
    clicks: 0,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// Update ecommerce product
export async function updateEcommerceProduct(id: string, data: Partial<EcommerceProduct>): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete ecommerce product
export async function deleteEcommerceProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// Get ecommerce product by ID
export async function getEcommerceProduct(id: string): Promise<EcommerceProduct | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as EcommerceProduct;
}

// Get all ecommerce products with filters
export async function getAllEcommerceProducts(filters?: {
  category?: string;
  platform?: string;
  city?: string;
  businessSlug?: string;
  query?: string;
  featured?: boolean;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
}): Promise<EcommerceProduct[]> {
  let q = query(collection(db, COL), orderBy('createdAt', 'desc'));

  const snap = await getDocs(q);
  let products = snap.docs.map(d => ({ id: d.id, ...d.data() } as EcommerceProduct));

  const f = filters;
  if (f?.category) products = products.filter(p => p.category?.toLowerCase().includes(f.category!.toLowerCase()));
  if (f?.platform) products = products.filter(p => p.platform?.toLowerCase() === f.platform!.toLowerCase());
  if (f?.city) products = products.filter(p => p.city?.toLowerCase() === f.city!.toLowerCase());
  if (f?.businessSlug) products = products.filter(p => p.businessSlug === f.businessSlug);
  if (f?.featured) products = products.filter(p => p.featured === f.featured);
  if (f?.active !== undefined) products = products.filter(p => p.active === f.active);
  if (f?.inStock !== undefined) products = products.filter(p => p.inStock === f.inStock);
  if (f?.minPrice) products = products.filter(p => p.price >= f.minPrice!);
  if (f?.maxPrice) products = products.filter(p => p.price <= f.maxPrice!);
  if (f?.tags && f.tags.length > 0) {
    products = products.filter(p =>
      f.tags!.some(tag => p.tags?.some(pt => pt.toLowerCase().includes(tag.toLowerCase())))
    );
  }
  if (f?.query) {
    const q2 = f.query.toLowerCase();
    products = products.filter(p =>
      p.title?.toLowerCase().includes(q2) ||
      p.description?.toLowerCase().includes(q2) ||
      p.brand?.toLowerCase().includes(q2) ||
      p.tags?.some(t => t.toLowerCase().includes(q2))
    );
  }

  return products;
}

// Get products for a business
export async function getBusinessEcommerceProducts(businessSlug: string): Promise<EcommerceProduct[]> {
  const q = query(
    collection(db, COL),
    where('businessSlug', '==', businessSlug),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EcommerceProduct));
}

// Search products
export async function searchEcommerceProducts(query: string, filters?: {
  category?: string;
  platform?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<EcommerceProduct[]> {
  return getAllEcommerceProducts({
    query,
    ...filters,
  });
}

// Get featured products
export async function getFeaturedProducts(limit: number = 10): Promise<EcommerceProduct[]> {
  const q = query(
    collection(db, COL),
    where('featured', '==', true),
    where('active', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EcommerceProduct));
}

// Get products by category
export async function getProductsByCategory(category: string, limit: number = 20): Promise<EcommerceProduct[]> {
  const allProducts = await getAllEcommerceProducts({ category, active: true });
  return allProducts.slice(0, limit);
}

// Increment product views
export async function incrementProductViews(productId: string): Promise<void> {
  await updateDoc(doc(db, COL, productId), {
    views: (await getDoc(doc(db, COL, productId))).data()?.views + 1 || 1,
  });
}

// Increment product clicks (affiliate tracking)
export async function incrementProductClicks(productId: string): Promise<void> {
  await updateDoc(doc(db, COL, productId), {
    clicks: (await getDoc(doc(db, COL, productId))).data()?.clicks + 1 || 1,
  });
}

// Get product categories
export function getProductCategories(): string[] {
  return [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Fitness',
    'Books & Stationery',
    'Toys & Games',
    'Automotive',
    'Health & Wellness',
    'Food & Grocery',
    'Mobile Accessories',
    'Computers & Accessories',
    'Camera & Photography',
    'Watches & Accessories',
    'Jewellery',
    'Furniture',
    'Baby & Kids',
    'Pet Supplies',
    'Garden & Outdoor',
    'Other',
  ];
}

// Get product statistics
export async function getProductStatistics(): Promise<{
  total: number;
  active: number;
  byPlatform: Record<string, number>;
  byCategory: Record<string, number>;
  totalViews: number;
  totalClicks: number;
}> {
  const snap = await getDocs(collection(db, COL));
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() } as EcommerceProduct));

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    byPlatform: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalClicks: products.reduce((sum, p) => sum + (p.clicks || 0), 0),
  };

  products.forEach(product => {
    if (product.platform) {
      stats.byPlatform[product.platform] = (stats.byPlatform[product.platform] || 0) + 1;
    }
    if (product.category) {
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
    }
  });

  return stats;
}

// Get recommended products based on user preferences
export async function getRecommendedProducts(
  userId: string,
  limit: number = 10
): Promise<EcommerceProduct[]> {
  try {
    // Get user preferences
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return [];

    const userData = userDoc.data();
    const userCategories = userData.preferredCategories || [];
    const userCity = userData.city || '';

    // Get products matching user preferences
    const allProducts = await getAllEcommerceProducts({ active: true });

    // Score products based on relevance
    const scoredProducts = allProducts.map(product => {
      let score = 0;

      // Match categories
      if (userCategories.length > 0 && product.category) {
        const categoryMatch = userCategories.some(cat =>
          cat.toLowerCase().includes(product.category!.toLowerCase()) ||
          product.category!.toLowerCase().includes(cat.toLowerCase())
        );
        if (categoryMatch) score += 10;
      }

      // Match city
      if (userCity && product.city && product.city.toLowerCase() === userCity.toLowerCase()) {
        score += 5;
      }

      // Boost featured products
      if (product.featured) score += 2;

      // Boost products with good ratings
      if (product.rating && product.rating >= 4) score += 3;

      return { product, score };
    });

    // Sort by score and return top results
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  } catch (error) {
    console.error('Error getting recommended products:', error);
    return [];
  }
}

// Get similar products
export async function getSimilarProducts(productId: string, limit: number = 6): Promise<EcommerceProduct[]> {
  try {
    const product = await getEcommerceProduct(productId);
    if (!product) return [];

    const similarProducts = await getAllEcommerceProducts({
      category: product.category,
      active: true,
    });

    // Exclude the current product
    return similarProducts
      .filter(p => p.id !== productId)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting similar products:', error);
    return [];
  }
}

// Bulk import products from URLs
export async function bulkImportProducts(
  businessSlug: string,
  businessName: string,
  postedBy: string,
  city: string,
  urls: string[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const url of urls) {
    try {
      const productData = await fetchProductFromUrl(url);
      if (!productData) {
        results.failed++;
        results.errors.push(`Failed to fetch product from ${url}`);
        continue;
      }

      await createEcommerceProduct({
        ...productData,
        businessSlug,
        businessName,
        postedBy,
        city,
        featured: false,
        active: true,
      });

      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Error importing ${url}: ${error}`);
    }
  }

  return results;
}

// Update product stock
export async function updateProductStock(productId: string, inStock: boolean, stockCount?: number): Promise<void> {
  await updateDoc(doc(db, COL, productId), {
    inStock,
    ...(stockCount !== undefined && { stockCount }),
    updatedAt: serverTimestamp(),
  });
}

// Get trending products (most viewed/clicked in last 7 days)
export async function getTrendingProducts(limit: number = 10): Promise<EcommerceProduct[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const q = query(
    collection(db, COL),
    where('active', '==', true),
    where('createdAt', '>=', sevenDaysAgo),
    orderBy('views', 'desc'),
    limit(limit)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EcommerceProduct));
}

// Get products on sale (discounted)
export async function getProductsOnSale(limit: number = 20): Promise<EcommerceProduct[]> {
  const allProducts = await getAllEcommerceProducts({ active: true, inStock: true });

  return allProducts
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
      const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
      return discountB - discountA;
    })
    .slice(0, limit);
}

// Validate product URL
export function validateProductUrl(url: string): { valid: boolean; platform?: string; error?: string } {
  try {
    const urlObj = new URL(url);

    // Check if it's a valid HTTPS URL
    if (urlObj.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTPS URLs are allowed' };
    }

    // Detect platform
    const platform = detectPlatform(url);

    if (platform === 'other') {
      return { valid: false, error: 'Unsupported platform. Please use Amazon, Flipkart, Meesho, Myntra, Nykaa, AJIO, Snapdeal, or JioMart' };
    }

    return { valid: true, platform };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// Generate affiliate link (in production, this would use actual affiliate networks)
export function generateAffiliateLink(originalUrl: string, platform: string): string {
  // In production, this would append affiliate tracking parameters
  // For now, we'll return the original URL
  return originalUrl;
}

// Calculate commission
export function calculateCommission(price: number, commissionRate: number): number {
  return (price * commissionRate) / 100;
}

// Get product performance analytics
export async function getProductPerformance(productId: string): Promise<{
  views: number;
  clicks: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
}> {
  try {
    const product = await getEcommerceProduct(productId);
    if (!product) {
      return {
        views: 0,
        clicks: 0,
        conversionRate: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      };
    }

    // Calculate conversion rate (clicks / views)
    const conversionRate = product.views > 0 ? (product.clicks / product.views) * 100 : 0;

    // In production, these would be calculated from actual analytics data
    return {
      views: product.views || 0,
      clicks: product.clicks || 0,
      conversionRate,
      avgTimeOnPage: Math.floor(Math.random() * 120) + 30, // Simulated
      bounceRate: Math.floor(Math.random() * 40) + 20, // Simulated
    };
  } catch (error) {
    console.error('Error getting product performance:', error);
    return {
      views: 0,
      clicks: 0,
      conversionRate: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
    };
  }
}