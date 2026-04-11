import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedBusinesses from '@/components/home/FeaturedBusinesses';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedBusinesses />
        <HowItWorks />
        <TrustSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
