import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })
  if (!user) redirect('/login')

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Account settings
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Update your name or reset your password.
        </p>
      </div>
      <SettingsForm name={user.name} email={user.email} />
    </div>
  )
}