import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="space-y-8">
      <AdminNav />
      {children}
    </div>
  )
}
