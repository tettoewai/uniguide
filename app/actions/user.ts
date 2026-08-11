'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export type AccountFormState = { error?: string; success?: string }

export async function updateProfileName(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const parsed = z
    .object({ name: z.string().min(1, 'Name is required').max(80, 'Name is too long') })
    .safeParse({ name: formData.get('name') })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid name' }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  return { success: 'Name updated' }
}

export async function changePassword(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const parsed = z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .safeParse({
      currentPassword: formData.get('currentPassword') ?? '',
      newPassword: formData.get('newPassword') ?? '',
      confirmPassword: formData.get('confirmPassword') ?? '',
    })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid form data' }
  }

  if (parsed.data.newPassword !== parsed.data.confirmPassword) {
    return { error: 'New passwords do not match' }
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) redirect('/login')

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!isValid) {
    return { error: 'Current password is incorrect' }
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: passwordHash },
  })

  return { success: 'Password updated' }
}

export type PreferencesInput = {
  budget: number | null
  preferredCityId: string | null
  latitude: number | null
  longitude: number | null
  preferredMajors: string[]
  marks: Record<string, number>
  hobbies: string[]
}

export async function updateUserPreferences(input: PreferencesInput) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id

  const parsed = z
    .object({
      budget: z.number().min(0).nullable(),
      preferredCityId: z.string().nullable(),
      latitude: z.number().min(-90).max(90).nullable(),
      longitude: z.number().min(-180).max(180).nullable(),
      preferredMajors: z.array(z.string()),
      marks: z.record(z.string(), z.number().min(0).max(100)),
      hobbies: z.array(z.string()),
    })
    .parse(input)

  await prisma.user.update({
    where: { id: userId },
    data: {
      budget: parsed.budget,
      preferredCityId: parsed.preferredCityId,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      preferredMajors: parsed.preferredMajors,
    },
  })

  await prisma.userSubjectMark.deleteMany({ where: { userId } })
  await prisma.userSubjectMark.createMany({
    data: Object.entries(parsed.marks).map(([subjectId, mark]) => ({
      userId,
      subjectId,
      mark,
    })),
  })

  await prisma.userHobby.deleteMany({ where: { userId } })
  await prisma.userHobby.createMany({
    data: parsed.hobbies.map((hobbyId) => ({ userId, hobbyId })),
  })

  redirect('/recommendations')
}

export async function isOnboarded(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      preferredCityId: true,
      _count: { select: { marks: true, hobbies: true } },
    },
  })
  return Boolean(user && (user.preferredCityId || user._count.marks > 0 || user._count.hobbies > 0))
}