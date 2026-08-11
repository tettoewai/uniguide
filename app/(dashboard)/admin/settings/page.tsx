import { prisma } from '@/lib/db'
import { SettingsForm } from '../../settings/settings-form'

export default async function AdminSettingsPage() {
  const user = await prisma.user.findFirst({
    select: { name: true, email: true },
  })
  if (!user) return null

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Account settings
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Update your name or reset your password.
        </p>
      </div>

      <SettingsForm name={user.name} email={user.email} />
    </>
  )
}
