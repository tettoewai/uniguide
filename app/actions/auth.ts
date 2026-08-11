'use server'

import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { signIn } from '@/auth'
import { getDictionary } from '@/lib/i18n/server'

function registerSchema(dict: Awaited<ReturnType<typeof getDictionary>>) {
  return z
    .object({
      name: z.string().min(1, dict.actions.nameRequired),
      email: z.string().email(dict.actions.invalidEmail),
      password: z.string().min(6, dict.actions.passwordTooShort),
      confirmPassword: z.string().min(6, dict.actions.passwordTooShort),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.actions.passwordsMismatch,
      path: ['confirmPassword'],
    })
}

function loginSchema(dict: Awaited<ReturnType<typeof getDictionary>>) {
  return z.object({
    email: z.string().email(dict.actions.invalidEmail),
    password: z.string().min(1, dict.actions.passwordRequired),
  })
}

export type AuthFormState = { error?: string }

export async function registerUser(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const dict = await getDictionary()
  const parsed = registerSchema(dict).safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidFormData }
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return { error: dict.actions.emailExists }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: passwordHash,
    },
  })

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: dict.actions.signInError }
    }
    throw error
  }

  return { error: dict.actions.signInError }
}

export async function loginUser(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const dict = await getDictionary()
  const parsed = loginSchema(dict).safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.actions.invalidFormData }
  }

  const rawCallbackUrl = formData.get('callbackUrl')
  const callbackUrl =
    typeof rawCallbackUrl === 'string' &&
    rawCallbackUrl.startsWith('/') &&
    !rawCallbackUrl.startsWith('//')
      ? rawCallbackUrl
      : '/dashboard'

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: dict.actions.invalidCredentials }
        default:
          return { error: dict.actions.genericError }
      }
    }
    throw error
  }

  return { error: dict.actions.genericError }
}

export async function logoutUser() {
  try {
    const { signOut } = await import('@/auth')
    await signOut({ redirectTo: '/login' })
  } catch {
    redirect('/login')
  }
}
