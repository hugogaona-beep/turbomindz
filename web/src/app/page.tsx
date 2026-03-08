import { HeroSection } from '@/components/home/HeroSection'
import { StatsBanner } from '@/components/home/StatsBanner'
import { FeaturedGallery } from '@/components/home/FeaturedGallery'
import { HowItWorks } from '@/components/home/HowItWorks'
import { DropCountdown } from '@/components/home/DropCountdown'
import { PhilosophyManifesto } from '@/components/home/PhilosophyManifesto'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TURBOMINDZ — Own The Philosophy. Join The Elite.',
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <FeaturedGallery />
      <HowItWorks />
      <PhilosophyManifesto />
      <DropCountdown />
      <FAQSection />
    </>
  )
}
