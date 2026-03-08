import type { Metadata } from 'next'
import { Zap } from 'lucide-react'

export const metadata: Metadata = { title: 'Team — TURBOMINDZ' }

const TEAM = [
  { role: 'Founder & Visionary',   name: 'TURBOMINDZ Team', bio: 'Building the intersection of philosophy and Web3 commerce.' },
  { role: 'Lead Developer',        name: 'Engineering',     bio: 'Next.js, Solidity, and blockchain infrastructure.' },
  { role: 'Community Lead',        name: 'Community',       bio: 'Discord management and member experience.' },
  { role: 'Creative Director',     name: 'Creative',        bio: 'AI art generation and design system.' },
]

export default function TeamPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">About</p>
        <h1 className="font-display text-h1 font-light mb-3">The Team</h1>
        <p className="text-muted font-body mb-12">Built by philosophers who ship.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {TEAM.map(m => (
            <div key={m.role} className="p-6 rounded-xl bg-midnight border border-border">
              <div className="w-12 h-12 rounded-full bg-electric/10 border border-electric/20 flex items-center justify-center mb-4">
                <Zap size={20} className="text-electric" />
              </div>
              <p className="text-xs text-electric uppercase tracking-wide mb-1 font-body">{m.role}</p>
              <h3 className="font-display text-lg font-light text-white mb-2">{m.name}</h3>
              <p className="text-muted text-sm font-body">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
