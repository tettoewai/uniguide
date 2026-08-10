import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { OnboardingForm } from './onboarding-form'

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { marks: true, hobbies: true },
  })

  const [subjects, majors, hobbies] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.major.findMany({ orderBy: { name: 'asc' } }),
    prisma.hobby.findMany({ orderBy: { name: 'asc' } }),
  ])

  const initialValues = {
    budget: user?.budget ?? null,
    preferredCity: user?.preferredCity ?? null,
    preferredMajors: user?.preferredMajors ?? [],
    marks: Object.fromEntries(
      user?.marks.map((m) => [m.subjectId, m.mark]) ?? [],
    ) as Record<string, number>,
    hobbies: user?.hobbies.map((h) => h.hobbyId) ?? [],
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center sm:text-left">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
          Personalize your results
        </span>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Tell us about yourself
        </h1>
        <p className="mt-3 max-w-xl text-base text-zinc-500 sm:text-lg">
          We use these to match you with the universities that fit you best. You can update this
          anytime.
        </p>
      </div>
      <OnboardingForm
        subjects={subjects}
        majors={majors}
        hobbies={hobbies}
        initialValues={initialValues}
      />
    </div>
  )
}