'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import {
  changePassword,
  updateProfileName,
  type AccountFormState,
} from '@/app/actions/user'
import { useLocale } from '@/components/providers/locale-provider'

const initialState: AccountFormState = {}

export function SettingsForm({ name, email }: { name: string; email: string }) {
  const { dict } = useLocale()
  const [nameState, nameAction, namePending] = useActionState<
    AccountFormState,
    FormData
  >(updateProfileName, initialState)
  const [passwordState, passwordAction, passwordPending] = useActionState<
    AccountFormState,
    FormData
  >(changePassword, initialState)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold tracking-tight text-card-foreground">
          {dict.settings.profile}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{dict.settings.profileHint}</p>
        <form action={nameAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{dict.settings.name}</Label>
            <Input
              id="name"
              name="name"
              defaultValue={name}
              required
              className="h-12 rounded-md border-0 bg-background ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{dict.settings.email}</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="h-12 rounded-md border-0 bg-background ring-1 ring-border outline-none"
            />
          </div>
          {nameState.error ? (
            <p className="text-sm text-destructive" role="alert">
              {nameState.error}
            </p>
          ) : null}
          {nameState.success ? (
            <p className="text-sm text-emerald-600" role="status">
              {nameState.success}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={namePending}
            className="h-11 rounded-full bg-primary px-8 hover:bg-sky-600"
          >
            {namePending ? dict.settings.savingName : dict.settings.saveName}
          </Button>
        </form>
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold tracking-tight text-card-foreground">
          {dict.settings.resetPassword}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {dict.settings.resetPasswordHint}
        </p>
        <form action={passwordAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{dict.settings.currentPassword}</Label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              required
              className="h-12 rounded-md border-0 bg-background ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{dict.settings.newPassword}</Label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              minLength={6}
              placeholder={dict.settings.newPasswordHint}
              required
              className="h-12 rounded-md border-0 bg-background ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{dict.settings.confirmNewPassword}</Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              minLength={6}
              required
              className="h-12 rounded-md border-0 bg-background ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300"
            />
          </div>
          {passwordState.error ? (
            <p className="text-sm text-destructive" role="alert">
              {passwordState.error}
            </p>
          ) : null}
          {passwordState.success ? (
            <p className="text-sm text-emerald-600" role="status">
              {passwordState.success}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={passwordPending}
            className="h-11 rounded-full bg-primary px-8 hover:bg-sky-600"
          >
            {passwordPending ? dict.settings.resetting : dict.settings.resetPasswordBtn}
          </Button>
        </form>
      </section>
    </div>
  )
}