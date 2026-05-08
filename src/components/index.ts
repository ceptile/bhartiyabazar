// This file exports all the main components and utilities for the BhartiyaBazar platform
// It serves as the main entry point for integrating all the flagship features

// Dashboard Components
export { default as DashboardClient } from './dashboard/DashboardClient';
export { default as JobsDashboard } from './dashboard/JobsDashboard';
export { default as EcommerceDashboard } from './dashboard/EcommerceDashboard';
export { default as BusinessPageEditor } from './dashboard/BusinessPageEditor';

// Core Libraries
export * from '../lib/security';
export * from '../lib/jobs-enhanced';
export * from '../lib/ecommerce';
export * from '../lib/business-page';

// Utility Functions
export const PLATFORM_INTEGRATION = {
  // Supported ecommerce platforms
  platforms: ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Nykaa', 'AJIO', 'Snapdeal', 'JioMart'],

  // Feature flags
  features: {
    aiSearch: true,
    jobBoard: true,
    ecommerce: true,
    businessPageCustomization: true,
    advancedSecurity: true,
    linkedinProfile: true,
    githubProfile: true,
    mapIntegration: true,
  },

  // Configuration
  config: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    maxProductsPerBusiness: 100,
    maxJobsPerUser: 20,
    maxMediaItems: 50,
  },
};

// Integration Helper Functions
export async function initializeDashboard(userId: string) {
  // Initialize all dashboard components and data
  const dashboardData = {
    user: null,
    stats: {
      jobs: 0,
      products: 0,
      views: 0,
      applications: 0,
    },
    recentActivity: [],
    recommendations: [],
  };

  return dashboardData;
}

export function getFeatureStatus(feature: string): boolean {
  return PLATFORM_INTEGRATION.features[feature as keyof typeof PLATFORM_INTEGRATION.features] || false;
}

export function getSupportedPlatforms(): string[] {
  return PLATFORM_INTEGRATION.platforms;
}