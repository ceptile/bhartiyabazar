import { db } from './firebase';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface BusinessTheme {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  spacing: string;
  shadow: string;
  animation: 'none' | 'fade' | 'slide' | 'bounce' | 'zoom';
  customCSS?: string;
}

export interface BusinessMedia {
  id: string;
  type: 'image' | 'video' | 'logo' | 'banner';
  url: string;
  thumbnail?: string;
  alt?: string;
  order: number;
  active: boolean;
  createdAt: Timestamp;
}

export interface BusinessPageSettings {
  businessSlug: string;
  theme: BusinessTheme;
  media: BusinessMedia[];
  heroSection: {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
    videoBackground?: string;
    ctaText: string;
    ctaLink: string;
    showMap: boolean;
    showReviews: boolean;
    showProducts: boolean;
  };
  aboutSection: {
    title: string;
    description: string;
    images: string[];
    showTeam: boolean;
    showTimeline: boolean;
  };
  servicesSection: {
    title: string;
    services: Array<{
      title: string;
      description: string;
      icon: string;
      price?: string;
    }>;
  };
  productsSection: {
    title: string;
    showFeatured: boolean;
    showAll: boolean;
    layout: 'grid' | 'list' | 'carousel';
  };
  reviewsSection: {
    title: string;
    showTestimonials: boolean;
    showRatings: boolean;
    maxReviews: number;
  };
  contactSection: {
    title: string;
    showForm: boolean;
    showMap: boolean;
    showHours: boolean;
    customMessage?: string;
  };
  socialSection: {
    showSocialLinks: boolean;
    showFollowButton: boolean;
    customMessage?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
  };
  advanced: {
    enableAnimations: boolean;
    enableLazyLoading: boolean;
    enableAnalytics: boolean;
    customScripts?: string;
    customHead?: string;
  };
  updatedAt: Timestamp;
}

// Get business page settings
export async function getBusinessPageSettings(businessSlug: string): Promise<BusinessPageSettings | null> {
  try {
    const snap = await getDoc(doc(db, 'business_page_settings', businessSlug));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as unknown as BusinessPageSettings;
  } catch (error) {
    console.error('Error getting business page settings:', error);
    return null;
  }
}

// Create or update business page settings
export async function updateBusinessPageSettings(
  businessSlug: string,
  settings: Partial<BusinessPageSettings>
): Promise<void> {
  try {
    const existing = await getBusinessPageSettings(businessSlug);
    const data = {
      ...settings,
      businessSlug,
      updatedAt: serverTimestamp(),
    };

    if (existing) {
      await updateDoc(doc(db, 'business_page_settings', businessSlug), data);
    } else {
      await addDoc(collection(db, 'business_page_settings'), data);
    }
  } catch (error) {
    console.error('Error updating business page settings:', error);
    throw error;
  }
}

// Upload media for business page
export async function uploadBusinessMedia(
  businessSlug: string,
  file: File,
  type: 'image' | 'video' | 'logo' | 'banner',
  order: number = 0
): Promise<BusinessMedia> {
  try {
    const fileName = `${businessSlug}/${type}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `business_media/${fileName}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Create thumbnail for videos
    let thumbnail: string | undefined;
    if (type === 'video') {
      // For now, we'll use a placeholder thumbnail
      // In production, you'd want to generate actual video thumbnails
      thumbnail = url; // This would be replaced with actual thumbnail generation
    }

    const mediaData = {
      type,
      url,
      thumbnail,
      alt: file.name,
      order,
      active: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'business_media'), {
      ...mediaData,
      businessSlug,
    });

    return { id: docRef.id, ...mediaData } as BusinessMedia;
  } catch (error) {
    console.error('Error uploading business media:', error);
    throw error;
  }
}

// Get all media for a business
export async function getBusinessMedia(businessSlug: string): Promise<BusinessMedia[]> {
  try {
    const q = query(
      collection(db, 'business_media'),
      where('businessSlug', '==', businessSlug),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BusinessMedia));
  } catch (error) {
    console.error('Error getting business media:', error);
    return [];
  }
}

// Delete business media
export async function deleteBusinessMedia(mediaId: string): Promise<void> {
  try {
    const mediaDoc = await getDoc(doc(db, 'business_media', mediaId));
    if (!mediaDoc.exists()) return;

    const mediaData = mediaDoc.data();

    // Delete from storage
    if (mediaData.url) {
      try {
        const storageRef = ref(storage, mediaData.url);
        await deleteObject(storageRef);
      } catch (error) {
        console.error('Error deleting from storage:', error);
      }
    }

    // Delete from database
    await deleteDoc(doc(db, 'business_media', mediaId));
  } catch (error) {
    console.error('Error deleting business media:', error);
    throw error;
  }
}

// Update media order
export async function updateMediaOrder(mediaItems: Array<{ id: string; order: number }>): Promise<void> {
  try {
    const batch = writeBatch(db);

    mediaItems.forEach(item => {
      const docRef = doc(db, 'business_media', item.id);
      batch.update(docRef, { order: item.order });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating media order:', error);
    throw error;
  }
}

// Get predefined themes
export function getPredefinedThemes(): BusinessTheme[] {
  return [
    {
      id: 'modern',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      borderRadius: '8px',
      spacing: 'medium',
      shadow: 'medium',
      animation: 'fade',
    },
    {
      id: 'elegant',
      primaryColor: '#7c3aed',
      secondaryColor: '#5b21b6',
      accentColor: '#ec4899',
      backgroundColor: '#faf5ff',
      textColor: '#1f2937',
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      borderRadius: '12px',
      spacing: 'large',
      shadow: 'light',
      animation: 'slide',
    },
    {
      id: 'bold',
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      accentColor: '#fbbf24',
      backgroundColor: '#fef2f2',
      textColor: '#1f2937',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      borderRadius: '4px',
      spacing: 'small',
      shadow: 'heavy',
      animation: 'bounce',
    },
    {
      id: 'minimal',
      primaryColor: '#374151',
      secondaryColor: '#1f2937',
      accentColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      headingFont: 'Helvetica',
      bodyFont: 'Helvetica',
      borderRadius: '0px',
      spacing: 'medium',
      shadow: 'none',
      animation: 'none',
    },
    {
      id: 'nature',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#fbbf24',
      backgroundColor: '#f0fdf4',
      textColor: '#1f2937',
      headingFont: 'Georgia',
      bodyFont: 'system-ui',
      borderRadius: '16px',
      spacing: 'large',
      shadow: 'medium',
      animation: 'fade',
    },
  ];
}

// Apply theme to business page
export async function applyTheme(businessSlug: string, themeId: string): Promise<void> {
  const themes = getPredefinedThemes();
  const theme = themes.find(t => t.id === themeId);

  if (!theme) {
    throw new Error('Theme not found');
  }

  await updateBusinessPageSettings(businessSlug, { theme });
}

// Get business page analytics
export async function getBusinessPageAnalytics(businessSlug: string, days: number = 30): Promise<{
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  trafficSources: Array<{ source: string; count: number }>;
}> {
  try {
    // This would typically query an analytics collection
    // For now, returning mock data
    return {
      views: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      avgTimeOnPage: Math.floor(Math.random() * 300) + 60,
      bounceRate: Math.floor(Math.random() * 50) + 20,
      topPages: [
        { page: '/', views: Math.floor(Math.random() * 500) + 100 },
        { page: '/about', views: Math.floor(Math.random() * 200) + 50 },
        { page: '/services', views: Math.floor(Math.random() * 300) + 75 },
      ],
      trafficSources: [
        { source: 'Google', count: Math.floor(Math.random() * 400) + 100 },
        { source: 'Direct', count: Math.floor(Math.random() * 200) + 50 },
        { source: 'Social', count: Math.floor(Math.random() * 150) + 25 },
      ],
    };
  } catch (error) {
    console.error('Error getting business page analytics:', error);
    return {
      views: 0,
      uniqueVisitors: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      topPages: [],
      trafficSources: [],
    };
  }
}

// Duplicate business page settings (for templates)
export async function duplicateBusinessPageSettings(
  sourceSlug: string,
  targetSlug: string
): Promise<void> {
  try {
    const sourceSettings = await getBusinessPageSettings(sourceSlug);
    if (!sourceSettings) {
      throw new Error('Source settings not found');
    }

    const { id: _id, ...settingsData } = sourceSettings as BusinessPageSettings & { id?: string };
    await updateBusinessPageSettings(targetSlug, settingsData);
  } catch (error) {
    console.error('Error duplicating business page settings:', error);
    throw error;
  }
}

// Reset business page to default
export async function resetBusinessPageToDefault(businessSlug: string): Promise<void> {
  const defaultTheme = getPredefinedThemes()[0];

  await updateBusinessPageSettings(businessSlug, {
    theme: defaultTheme,
    heroSection: {
      headline: 'Welcome to Our Business',
      subheadline: 'We provide excellent services',
      ctaText: 'Contact Us',
      ctaLink: '#contact',
      showMap: true,
      showReviews: true,
      showProducts: true,
    },
    aboutSection: {
      title: 'About Us',
      description: 'Learn more about our business',
      images: [],
      showTeam: false,
      showTimeline: false,
    },
    servicesSection: {
      title: 'Our Services',
      services: [],
    },
    productsSection: {
      title: 'Our Products',
      showFeatured: true,
      showAll: false,
      layout: 'grid',
    },
    reviewsSection: {
      title: 'Customer Reviews',
      showTestimonials: true,
      showRatings: true,
      maxReviews: 6,
    },
    contactSection: {
      title: 'Contact Us',
      showForm: true,
      showMap: true,
      showHours: true,
    },
    socialSection: {
      showSocialLinks: true,
      showFollowButton: true,
    },
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
    advanced: {
      enableAnimations: true,
      enableLazyLoading: true,
      enableAnalytics: true,
    },
  });
}

// Export business page settings as JSON
export async function exportBusinessPageSettings(businessSlug: string): Promise<string> {
  const settings = await getBusinessPageSettings(businessSlug);
  if (!settings) {
    throw new Error('Settings not found');
  }
  return JSON.stringify(settings, null, 2);
}

// Import business page settings from JSON
export async function importBusinessPageSettings(
  businessSlug: string,
  jsonData: string
): Promise<void> {
  try {
    const settings = JSON.parse(jsonData);
    await updateBusinessPageSettings(businessSlug, settings);
  } catch (error) {
    console.error('Error importing business page settings:', error);
    throw new Error('Invalid JSON data');
  }
}