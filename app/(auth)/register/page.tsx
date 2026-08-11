import { RegisterForm } from './register-form'

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-muted-foreground">Start your journey to the right university.</p>
      <RegisterForm />
    </div>
  )
}