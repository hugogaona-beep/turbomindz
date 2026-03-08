import Link from 'next/link'
import { Zap } from 'lucide-react'

const LINKS = {
  Platform:  [
    { href: '/collection/explore',   label: 'Collection' },
    { href: '/marketplace/listings', label: 'Marketplace' },
    { href: '/community/rooms',      label: 'Community' },
    { href: '/drops/upcoming',       label: 'Drops' },
  ],
  Earn: [
    { href: '/affiliate/apply',       label: 'Become an Affiliate' },
    { href: '/affiliate/leaderboard', label: 'Leaderboard' },
    { href: '/marketplace/create',    label: 'Create Listing' },
  ],
  Company: [
    { href: '/about/manifesto',      label: 'Manifesto' },
    { href: '/about/team',           label: 'Team' },
    { href: '/about/transparency',   label: 'Transparency' },
  ],
  Legal: [
    { href: '/legal/terms',              label: 'Terms' },
    { href: '/legal/privacy',            label: 'Privacy' },
    { href: '/legal/nft-ownership-rights', label: 'NFT Rights' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-midnight mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-electric/10 border border-electric/30 flex items-center justify-center">
                <Zap size={14} className="text-electric" />
              </div>
              <span className="font-display text-lg text-white">
                TURBO<span className="text-electric">MINDZ</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              3,000 exclusive NFTs merging AI art with timeless wisdom.
            </p>
            <p className="text-muted text-xs mt-4">
              © {new Date().getFullYear()} TURBOMINDZ.
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            Built on Ethereum. Powered by philosophy.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/turbomindz" target="_blank" rel="noopener" className="text-xs text-muted hover:text-electric transition-colors">Discord</a>
            <a href="https://twitter.com/turbomindz"  target="_blank" rel="noopener" className="text-xs text-muted hover:text-electric transition-colors">Twitter</a>
            <a href="https://opensea.io/collection/turbomindz" target="_blank" rel="noopener" className="text-xs text-muted hover:text-electric transition-colors">OpenSea</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
