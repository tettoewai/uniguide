import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { OnboardingForm } from './onboarding-form'
import { getDictionary } from '@/lib/i18n/server'

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const dict = await getDictionary()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { marks: true, hobbies: true },
  })

  const [subjects, majors, hobbies, cities] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.major.findMany({ orderBy: { name: 'asc' } }),
    prisma.hobby.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
  ])

  const initialValues = {
    budget: user?.budget ?? null,
    preferredCityId: user?.preferredCityId ?? null,
    latitude: user?.latitude ?? null,
    longitude: user?.longitude ?? null,
    preferredMajors: user?.preferredMajors ?? [],
    marks: Object.fromEntries(
      user?.marks.map((m) => [m.subjectId, m.mark]) ?? [],
    ) as Record<string, number>,
    hobbies: user?.hobbies.map((h) => h.hobbyId) ?? [],
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center sm:text-left">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {dict.onboarding.badge}
        </span>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.onboarding.title}
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
          {dict.onboarding.subtitle}
        </p>
      </div>
      <OnboardingForm
        subjects={subjects}
        majors={majors}
        hobbies={hobbies}
        cities={cities.map((c) => ({ id: c.id, name: c.name }))}
        initialValues={initialValues}
      />
    </div>
  )
}