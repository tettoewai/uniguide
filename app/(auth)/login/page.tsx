import { LoginForm } from './login-form'

export default async function LoginPage(props: PageProps<'/login'>) {
  const searchParams = await props.searchParams
  const callbackUrl = typeof searchParams?.callbackUrl === 'string' ? searchParams.callbackUrl : undefined

  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-zinc-500">
        Find the right university for your marks, budget and interests.
      </p>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  )
}