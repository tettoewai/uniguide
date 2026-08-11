import { prisma } from '@/lib/db'
import { SettingsForm } from '../../settings/settings-form'
import { getDictionary } from '@/lib/i18n/server'

export default async function AdminSettingsPage() {
  const user = await prisma.user.findFirst({
    select: { name: true, email: true },
  })
  if (!user) return null

  const dict = await getDictionary()

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.settings.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.settings.subtitle}
        </p>
      </div>

      <SettingsForm name={user.name} email={user.email} />
    </>
  )
}
