import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-16 min-h-screen flex">
      <DashboardSidebar />
      <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  )
}
