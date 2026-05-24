import Navbar from '@/components/marketing/Navbar'
import Hero from '@/components/marketing/Hero'
import ExpensiveSection from '@/components/marketing/ExpensiveSection'
import SavingsSection from '@/components/marketing/SavingsSection'
import SignupSection from '@/components/marketing/SignupSection'
import '@/styles/marketing.css'

export default function MarketingPage() {
  return (
    <div className="marketing-page">
      <Navbar />
      <Hero />
      <ExpensiveSection />
      <SavingsSection />
      <SignupSection />
      <footer className="footer">© 2026 Fisher · Built for students 🎓</footer>
    </div>
  )
}
