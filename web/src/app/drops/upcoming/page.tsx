import type { Metadata } from 'next'
import { DropCountdown } from '@/components/home/DropCountdown'
import { DropNotifyForm } from '@/components/drops/DropNotifyForm'

export const metadata: Metadata = { title: 'Upcoming Drop — TURBOMINDZ' }

export default function DropsPage() {
  return (
    <div className="pt-16 min-h-screen">
      <DropCountdown />
      <div className="max-w-md mx-auto px-4 pb-24">
        <DropNotifyForm />
      </div>
    </div>
  )
}
