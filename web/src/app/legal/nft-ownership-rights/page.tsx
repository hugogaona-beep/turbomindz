import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'NFT Ownership Rights — TURBOMINDZ' }

export default function NFTRightsPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-h1 font-light mb-2">NFT Ownership Rights</h1>
        <p className="text-muted text-sm font-body mb-12">What you own when you hold a TURBOMINDZ NFT.</p>
        <div className="space-y-6 text-sm font-body text-muted leading-relaxed">
          {[
            { title: '✅ Full Commercial Rights',     body: 'Use the artwork in any commercial project — merchandise, branding, advertising, media.' },
            { title: '✅ Resale Rights',              body: 'Sell or transfer your NFT freely on any marketplace. Service payloads transfer with it.' },
            { title: '✅ Service Payload Transfer',   body: 'Any services loaded onto your NFT transfer automatically to the new owner upon sale.' },
            { title: '✅ Platform Access',            body: 'Verified NFT ownership grants access to gated Discord rooms and community features.' },
            { title: '❌ Trademark',                  body: 'You do not own the TURBOMINDZ name, logo, or brand.' },
            { title: '❌ Other Tokens',               body: 'Rights apply to your specific token only. You have no rights over other tokens in the collection.' },
          ].map(item => (
            <div key={item.title} className="p-5 rounded-xl bg-midnight border border-border">
              <h3 className="font-body font-semibold text-white mb-1.5">{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
