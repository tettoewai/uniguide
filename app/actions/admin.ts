'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')
}

export type AdminFormState = { error?: string }

function parseUniversityForm(formData: FormData) {
  const majorIds = formData
    .getAll('majorIds')
    .map((v) => String(v))
    .filter(Boolean)

  const subjectIdKeys = Array.from(formData.keys()).filter((k) => k.startsWith('subjectReq-'))

  const parsed = z
    .object({
      name: z.string().min(1),
      city: z.string().min(1),
      annualFee: z.coerce.number().min(0).nullable(),
      totalMarkRequired: z.coerce.number().min(0).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      city: formData.get('city'),
      annualFee: formData.get('annualFee') === '' ? null : formData.get('annualFee'),
      totalMarkRequired:
        formData.get('totalMarkRequired') === '' ? null : formData.get('totalMarkRequired'),
    })
  if (!parsed.success) {
    return { error: 'Please fill in name and city.' }
  }

  const subjectReqs: Record<string, number> = {}
  for (const key of subjectIdKeys) {
    const subjectId = key.replace('subjectReq-', '')
    const value = formData.get(key)
    if (typeof value === 'string' && value !== '') {
      subjectReqs[subjectId] = Number(value)
    }
  }

  if (parsed.data.totalMarkRequired !== null && Object.keys(subjectReqs).length > 0) {
    return {
      error: 'Set either an overall average or subject minimum marks, not both.',
    }
  }

  return { majorIds, subjectReqs, data: parsed.data }
}

export async function createUniversity(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const result = parseUniversityForm(formData)
  if ('error' in result) return { error: result.error }

  await prisma.university.create({
    data: {
      name: result.data.name,
      cityId: result.data.city,
      annualFee: result.data.annualFee,
      totalMarkRequired: result.data.totalMarkRequired,
      majors: {
        create: result.majorIds.map((majorId) => ({ majorId })),
      },
      subjectReqs: {
        create: Object.entries(result.subjectReqs).map(([subjectId, minMark]) => ({
          subjectId,
          minMark,
        })),
      },
    },
  })

  return { error: undefined }
}

export async function updateUniversity(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const result = parseUniversityForm(formData)
  if ('error' in result) return { error: result.error }

  await prisma.$transaction([
    prisma.university.update({
      where: { id },
      data: {
        name: result.data.name,
        cityId: result.data.city,
        annualFee: result.data.annualFee,
        totalMarkRequired: result.data.totalMarkRequired,
      },
    }),
    prisma.universityMajor.deleteMany({ where: { universityId: id } }),
    prisma.universityMajor.createMany({
      data: result.majorIds.map((majorId) => ({ universityId: id, majorId })),
    }),
    prisma.universitySubjectRequirement.deleteMany({ where: { universityId: id } }),
    prisma.universitySubjectRequirement.createMany({
      data: Object.entries(result.subjectReqs).map(([subjectId, minMark]) => ({
        universityId: id,
        subjectId,
        minMark,
      })),
    }),
  ])

  return { error: undefined }
}

export async function deleteUniversity(id: string): Promise<{ error?: string }> {
  await requireAdmin()

  try {
    await prisma.$transaction([
      prisma.universitySubjectRequirement.deleteMany({ where: { universityId: id } }),
      prisma.universityMajor.deleteMany({ where: { universityId: id } }),
      prisma.scholarship.deleteMany({ where: { universityId: id } }),
      prisma.recommendation.deleteMany({ where: { universityId: id } }),
    ])
    await prisma.university.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'This university has favorites or reviews and cannot be deleted.' }
  }
}

export async function createSubject(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({ name: z.string().min(1, 'Name is required').max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid name' }

  try {
    await prisma.subject.create({ data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: 'A subject with this name already exists.' }
  }
}

export async function updateSubject(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({ name: z.string().min(1, 'Name is required').max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid name' }

  try {
    await prisma.subject.update({ where: { id }, data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: 'A subject with this name already exists.' }
  }
}

export async function deleteSubject(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  try {
    await prisma.subject.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'This subject is used by requirements or marks and cannot be deleted.' }
  }
}

export async function createMajor(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({ name: z.string().min(1, 'Name is required').max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid name' }

  try {
    await prisma.major.create({ data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: 'A major with this name already exists.' }
  }
}

export async function updateMajor(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({ name: z.string().min(1, 'Name is required').max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid name' }

  try {
    await prisma.major.update({ where: { id }, data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: 'A major with this name already exists.' }
  }
}

export async function deleteMajor(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  try {
    await prisma.major.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'This major is linked to universities or hobbies and cannot be deleted.' }
  }
}

export async function createHobby(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({
      name: z.string().min(1, 'Name is required').max(100),
      icon: z.string().max(50).nullable(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a valid color').nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      icon: formData.get('icon') === '' ? null : formData.get('icon'),
      color: formData.get('color') === '' ? null : formData.get('color'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    await prisma.hobby.create({
      data: {
        name: parsed.data.name.trim(),
        icon: parsed.data.icon,
        color: parsed.data.color,
      },
    })
    return { error: undefined }
  } catch {
    return { error: 'A hobby with this name already exists.' }
  }
}

export async function updateHobby(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({
      name: z.string().min(1, 'Name is required').max(100),
      icon: z.string().max(50).nullable(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a valid color').nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      icon: formData.get('icon') === '' ? null : formData.get('icon'),
      color: formData.get('color') === '' ? null : formData.get('color'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    await prisma.hobby.update({
      where: { id },
      data: {
        name: parsed.data.name.trim(),
        icon: parsed.data.icon,
        color: parsed.data.color,
      },
    })
    return { error: undefined }
  } catch {
    return { error: 'A hobby with this name already exists.' }
  }
}

export async function deleteHobby(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  try {
    await prisma.hobby.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'This hobby is linked to users or majors and cannot be deleted.' }
  }
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  try {
    await prisma.review.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'Could not delete this review.' }
  }
}

export async function createCity(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({
      name: z.string().min(1, 'Name is required').max(100),
      latitude: z.coerce.number().min(-90).max(90).nullable(),
      longitude: z.coerce.number().min(-180).max(180).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      latitude: formData.get('latitude') === '' ? null : formData.get('latitude'),
      longitude: formData.get('longitude') === '' ? null : formData.get('longitude'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    await prisma.city.create({
      data: {
        name: parsed.data.name.trim(),
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
      },
    })
    return { error: undefined }
  } catch {
    return { error: 'A city with this name already exists.' }
  }
}

export async function updateCity(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()

  const parsed = z
    .object({
      name: z.string().min(1, 'Name is required').max(100),
      latitude: z.coerce.number().min(-90).max(90).nullable(),
      longitude: z.coerce.number().min(-180).max(180).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      latitude: formData.get('latitude') === '' ? null : formData.get('latitude'),
      longitude: formData.get('longitude') === '' ? null : formData.get('longitude'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    await prisma.city.update({
      where: { id },
      data: {
        name: parsed.data.name.trim(),
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
      },
    })
    return { error: undefined }
  } catch {
    return { error: 'A city with this name already exists.' }
  }
}

export async function deleteCity(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  try {
    await prisma.city.delete({ where: { id } })
    return {}
  } catch {
    return { error: 'This city is linked to users or universities and cannot be deleted.' }
  }
}