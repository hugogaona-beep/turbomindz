import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — TURBOMINDZ' }

export default function PrivacyPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-h1 font-light mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm font-body mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="prose prose-invert max-w-none font-body space-y-6 text-muted text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Wallet address (required for authentication)</li>
              <li>Email address (optional, for notifications)</li>
              <li>Discord ID (if linked)</li>
              <li>Usage data via Vercel Analytics (anonymous)</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">How We Use It</h2>
            <p>We use your wallet address to verify NFT ownership and authenticate sessions. We never sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">Cookies</h2>
            <p>We use a single secure HTTP-only cookie for session management. No tracking cookies.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-light text-white mb-3">Your Rights</h2>
            <p>You may request deletion of your account and associated data at any time by contacting <a href="mailto:privacy@turbomindz.com" className="text-electric hover:underline">privacy@turbomindz.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
