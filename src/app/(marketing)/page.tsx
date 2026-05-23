import Navbar from '@/components/marketing/Navbar'
import Hero from '@/components/marketing/Hero'
import ExpensiveSection from '@/components/marketing/ExpensiveSection'
import SavingsSection from '@/components/marketing/SavingsSection'
import SignupSection from '@/components/marketing/SignupSection'

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExpensiveSection />
        <SavingsSection />
        <SignupSection />
      </main>
      <footer className="footer">
        © 2026 ClearMint · Built for students · Alberta, Canada
      </footer>
    </>
  )
}
