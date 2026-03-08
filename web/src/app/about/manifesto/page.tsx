import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manifesto — TURBOMINDZ' }

const PRINCIPLES = [
  { n: '01', title: 'Ownership Is Everything',      body: 'We believe in absolute ownership — of your NFT, your rights, and your future. No platform controls you here.' },
  { n: '02', title: 'Philosophy Drives Commerce',   body: 'The greatest businesses in history were built on ideas. TURBOMINDZ connects wisdom with wealth-building.' },
  { n: '03', title: 'Community Is Infrastructure',  body: 'Real networking happens when everyone in the room has skin in the game. Verified holders. Real conversations.' },
  { n: '04', title: 'Scarcity Creates Legacy',      body: '3,000 minds. One series. When it sells out, it never returns. What you hold becomes rarer every day.' },
  { n: '05', title: 'Action Over Theory',           body: 'We don\'t collect philosophers for decoration. We apply their frameworks to execution, today.' },
]

export default function ManifestoPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <p className="text-xs text-electric uppercase tracking-widest font-body mb-4">Our Manifesto</p>
        <blockquote className="font-display text-display-lg font-light leading-none mb-8">
          "The unexamined life<br />
          <span className="text-gradient-gold">is not worth living."</span>
        </blockquote>
        <p className="text-muted font-body text-lg leading-relaxed mb-16 max-w-2xl">
          TURBOMINDZ was built for those who refuse to separate thinking from doing.
          Philosophy is not decoration — it is infrastructure. Every NFT in this collection
          encodes a framework for living and building.
        </p>

        <div className="space-y-8">
          {PRINCIPLES.map(p => (
            <div key={p.n} className="flex gap-6 group">
              <span className="font-mono text-electric/40 text-sm flex-shrink-0 pt-1">{p.n}</span>
              <div className="border-l border-border pl-6 group-hover:border-electric/30 transition-colors">
                <h3 className="font-display text-xl font-light text-white mb-2">{p.title}</h3>
                <p className="text-muted font-body text-sm leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
