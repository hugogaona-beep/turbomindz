import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service — TURBOMINDZ' }

export default function TermsPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-h1 font-light mb-2">Terms of Service</h1>
        <p className="text-muted text-sm font-body mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="prose prose-invert max-w-none font-body space-y-6 text-muted text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using TURBOMINDZ ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">2. NFT Ownership</h2>
            <p>When you purchase a TURBOMINDZ NFT, you own the underlying artwork and receive full commercial rights to that specific token. You do not own the TURBOMINDZ trademark or brand.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">3. Marketplace Listings</h2>
            <p>Users are solely responsible for their marketplace listings. TURBOMINDZ does not verify the accuracy of listing claims and is not liable for transactions between members.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">4. Community Standards</h2>
            <p>Users must not post illegal content, harass other members, or engage in fraudulent activity. TURBOMINDZ reserves the right to remove content and revoke access for violations.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">5. Affiliate Program</h2>
            <p>Affiliate commissions are earned on qualifying purchases. TURBOMINDZ reserves the right to modify commission rates and program terms at any time with 30 days notice.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">6. Limitation of Liability</h2>
            <p>TURBOMINDZ is not liable for any indirect, incidental, or consequential damages arising from use of the Platform, including losses related to NFT price fluctuations.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">7. Contact</h2>
            <p>For legal inquiries: <a href="mailto:legal@turbomindz.com" className="text-electric hover:underline">legal@turbomindz.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
