import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { SettingsForm } from '../../settings/settings-form'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })
  if (!user) redirect('/login')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Account settings
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Update your name or reset your password.
        </p>
      </div>

      <SettingsForm name={user.name} email={user.email} />
    </div>
  )
}