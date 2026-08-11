import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { SettingsForm } from './settings-form'
import { getDictionary } from '@/lib/i18n/server'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const dict = await getDictionary()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })
  if (!user) redirect('/login')

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {dict.settings.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.settings.subtitle}
        </p>
      </div>
      <SettingsForm name={user.name} email={user.email} />
    </div>
  )
}