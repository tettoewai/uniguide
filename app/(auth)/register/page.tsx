import { RegisterForm } from './register-form'
import { getDictionary } from '@/lib/i18n/server'

export default async function RegisterPage() {
  const dict = await getDictionary()
  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-muted-foreground">{dict.auth.register.blurb}</p>
      <RegisterForm />
    </div>
  )
}