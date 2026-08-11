import type { Metadata } from 'next'
import { Inter, Outfit, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { getServerContext } from '@/lib/i18n/server'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerContext()
  return {
    title: 'UniGuide',
    description: dict.meta.description,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, dict } = await getServerContext()

  return (
    <html
      lang={locale}
      data-locale={locale}
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider locale={locale} dict={dict}>
            {children}
            <Toaster />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
