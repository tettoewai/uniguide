'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { getDictionary } from '@/lib/i18n/server'
import { format } from '@/lib/i18n/config'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')
}

export type AdminFormState = { error?: string }

type Dict = Awaited<ReturnType<typeof getDictionary>>

function parseUniversityForm(formData: FormData, dict: Dict) {
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
    return { error: dict.actions.fillNameCity }
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
      error: dict.actions.eitherOr,
    }
  }

  return { majorIds, subjectReqs, data: parsed.data }
}

export async function createUniversity(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const result = parseUniversityForm(formData, dict)
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
  const dict = await getDictionary()

  const result = parseUniversityForm(formData, dict)
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
  const dict = await getDictionary()

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
    return { error: dict.actions.cannotDeleteUniversity }
  }
}

export async function createSubject(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({ name: z.string().min(1, dict.actions.nameRequired).max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidName }

  try {
    await prisma.subject.create({ data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.subject.toLowerCase() }) }
  }
}

export async function updateSubject(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({ name: z.string().min(1, dict.actions.nameRequired).max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidName }

  try {
    await prisma.subject.update({ where: { id }, data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.subject.toLowerCase() }) }
  }
}

export async function deleteSubject(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const dict = await getDictionary()
  try {
    await prisma.subject.delete({ where: { id } })
    return {}
  } catch {
    return { error: dict.actions.cannotDeleteSubject }
  }
}

export async function createMajor(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({ name: z.string().min(1, dict.actions.nameRequired).max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidName }

  try {
    await prisma.major.create({ data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.major.toLowerCase() }) }
  }
}

export async function updateMajor(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({ name: z.string().min(1, dict.actions.nameRequired).max(100) })
    .safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidName }

  try {
    await prisma.major.update({ where: { id }, data: { name: parsed.data.name.trim() } })
    return { error: undefined }
  } catch {
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.major.toLowerCase() }) }
  }
}

export async function deleteMajor(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const dict = await getDictionary()
  try {
    await prisma.major.delete({ where: { id } })
    return {}
  } catch {
    return { error: dict.actions.cannotDeleteMajor }
  }
}

export async function createHobby(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({
      name: z.string().min(1, dict.actions.nameRequired).max(100),
      icon: z.string().max(50).nullable(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, dict.actions.pickValidColor).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      icon: formData.get('icon') === '' ? null : formData.get('icon'),
      color: formData.get('color') === '' ? null : formData.get('color'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidInput }

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
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.hobby.toLowerCase() }) }
  }
}

export async function updateHobby(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({
      name: z.string().min(1, dict.actions.nameRequired).max(100),
      icon: z.string().max(50).nullable(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, dict.actions.pickValidColor).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      icon: formData.get('icon') === '' ? null : formData.get('icon'),
      color: formData.get('color') === '' ? null : formData.get('color'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidInput }

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
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.hobby.toLowerCase() }) }
  }
}

export async function deleteHobby(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const dict = await getDictionary()
  try {
    await prisma.hobby.delete({ where: { id } })
    return {}
  } catch {
    return { error: dict.actions.cannotDeleteHobby }
  }
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const dict = await getDictionary()
  try {
    await prisma.review.delete({ where: { id } })
    return {}
  } catch {
    return { error: dict.actions.cannotDeleteReview }
  }
}

export async function createCity(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({
      name: z.string().min(1, dict.actions.nameRequired).max(100),
      latitude: z.coerce.number().min(-90).max(90).nullable(),
      longitude: z.coerce.number().min(-180).max(180).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      latitude: formData.get('latitude') === '' ? null : formData.get('latitude'),
      longitude: formData.get('longitude') === '' ? null : formData.get('longitude'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidInput }

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
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.city.toLowerCase() }) }
  }
}

export async function updateCity(
  id: string,
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin()
  const dict = await getDictionary()

  const parsed = z
    .object({
      name: z.string().min(1, dict.actions.nameRequired).max(100),
      latitude: z.coerce.number().min(-90).max(90).nullable(),
      longitude: z.coerce.number().min(-180).max(180).nullable(),
    })
    .safeParse({
      name: formData.get('name'),
      latitude: formData.get('latitude') === '' ? null : formData.get('latitude'),
      longitude: formData.get('longitude') === '' ? null : formData.get('longitude'),
    })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidInput }

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
    return { error: format(dict.actions.exists, { kind: dict.admin.kinds.city.toLowerCase() }) }
  }
}

export async function deleteCity(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const dict = await getDictionary()
  try {
    await prisma.city.delete({ where: { id } })
    return {}
  } catch {
    return { error: dict.actions.cannotDeleteCity }
  }
}
