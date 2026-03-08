import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { truncateAddress } from '@/lib/utils'
import { CheckCircle2, Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Member Directory — TURBOMINDZ' }

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { joinDate: 'desc' },
    take:    60,
    select: {
      walletAddress: true,
      username:      true,
      avatar:        true,
      isVerified:    true,
      role:          true,
      joinDate:      true,
    },
  })

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Community</p>
          <h1 className="font-display text-h1 font-light flex items-center gap-3">
            <Users size={32} className="text-electric" />
            Member Directory
          </h1>
          <p className="text-muted font-body mt-3">{members.length} verified holders</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <div
              key={member.walletAddress}
              className="p-4 rounded-xl bg-midnight border border-border hover:border-electric/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-electric/10 border border-electric/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-electric text-xs font-bold">
                    {member.walletAddress.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-white text-sm truncate">
                      {member.username || truncateAddress(member.walletAddress)}
                    </p>
                    {member.isVerified && (
                      <CheckCircle2 size={13} className="text-electric flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    Joined {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {member.role === 'AFFILIATE' && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30 flex-shrink-0">
                    Partner
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
