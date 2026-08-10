import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles, MapPinned, BookmarkCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 text-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/70 bg-sky-50 px-4 py-1.5 text-xs font-semibold text-sky-600">
            <Sparkles className="size-3.5" />
            Built for Myanmar students
          </span>
<h1 className="font-display text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl md:text-7xl">
          Find the university that{' '}
          <span className="text-sky-600">fits you best</span>
        </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 sm:text-xl">
            Enter your Grade 12 marks, budget, preferred city and interests. UniGuide scores every
            university and shows you the best matches.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 rounded-full bg-primary px-10 shadow-lg shadow-sky-300/60 hover:bg-sky-600',
            )}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-12 rounded-full border-white/50 bg-white/60 px-10 backdrop-blur-md hover:bg-white/90',
            )}
          >
            Sign in
          </Link>
        </div>

        <div className="mt-6 grid w-full gap-4 text-left sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: 'Smart scoring',
              desc: 'Marks, budget, majors, interests and location weighted into one fit score.',
            },
            {
              icon: MapPinned,
              title: 'Interactive map',
              desc: 'See every recommended university on an interactive campus map.',
            },
            {
              icon: BookmarkCheck,
              title: 'Favorites & reviews',
              desc: 'Save shortlists and read reviews from current students.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-card-soft backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-sky-300/50">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-zinc-800">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}