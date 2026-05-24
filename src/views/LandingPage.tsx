'use client'

import Navbar from '@/components/marketing/Navbar'
import Hero from '@/components/marketing/Hero'
import ExpensiveSection from '@/components/marketing/ExpensiveSection'
import SavingsSection from '@/components/marketing/SavingsSection'
import SignupSection from '@/components/marketing/SignupSection'

/** Full marketing landing — hero, stats, savings demo, signup CTA. */
export function LandingPage() {
  return (
    <div className="marketing-page">
      <Navbar />
      <Hero />
      <ExpensiveSection />
      <SavingsSection />
      <SignupSection />
    </div>
  )
}
