import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { cn } from '@/lib/utils'
import { getDictionary } from '@/lib/i18n/server'
import { Sparkles, MapPinned, BookmarkCheck } from 'lucide-react'

export default async function HomePage() {
  const dict = await getDictionary()
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 text-center">
        <LocaleSwitcher />
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="size-3.5" />
            {dict.landing.badge}
          </span>
<h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          {dict.landing.heroTitle}{' '}
          <span className="text-sky-600">{dict.landing.heroHighlight}</span>
        </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {dict.landing.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 rounded-full bg-primary px-10 hover:bg-sky-600',
            )}
          >
            {dict.landing.getStarted}
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-12 rounded-full border-border bg-card/60 px-10 backdrop-blur-md hover:bg-card/90',
            )}
          >
            {dict.landing.signIn}
          </Link>
        </div>

        <div className="mt-6 grid w-full gap-4 text-left sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: dict.landing.features[0].title,
              desc: dict.landing.features[0].desc,
            },
            {
              icon: MapPinned,
              title: dict.landing.features[1].title,
              desc: dict.landing.features[1].desc,
            },
            {
              icon: BookmarkCheck,
              title: dict.landing.features[2].title,
              desc: dict.landing.features[2].desc,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-card-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}