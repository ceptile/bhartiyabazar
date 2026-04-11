import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedBusinesses from '@/components/home/FeaturedBusinesses';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import RecentlyAdded from '@/components/home/RecentlyAdded';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedBusinesses />
      <HowItWorks />
      <TestimonialsSection />
      <TrustSection />
      <RecentlyAdded />
      <CTASection />
    </>
  );
}
