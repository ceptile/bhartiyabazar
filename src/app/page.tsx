import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturedBusinesses from '@/components/home/FeaturedBusinesses'
import HowItWorks from '@/components/home/HowItWorks'
import TrustSection from '@/components/home/TrustSection'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedBusinesses />
      <HowItWorks />
      <TrustSection />
      <CTASection />
    </>
  )
}
