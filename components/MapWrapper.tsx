'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocale } from '@/components/providers/locale-provider'
import { MapPinned } from 'lucide-react'

export type MapUniversity = {
  id: string
  name: string
  latitude: number
  longitude: number
  score: number
}

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full" />,
})

export function MapWrapper({ universities }: { universities: MapUniversity[] }) {
  const [mounted, setMounted] = useState(false)
  const { dict } = useLocale()

  useEffect(() => {
    let active = true
    import('leaflet/dist/leaflet.css').then(() => {
      if (active) setMounted(true)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3 backdrop-blur-md">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPinned className="size-4 text-sky-500" />
          {dict.map.title}
        </span>
        {universities.length > 0 ? (
          <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {universities.length} {universities.length === 1 ? dict.map.university : dict.map.universities}
          </span>
        ) : null}
      </div>
      {!mounted ? <Skeleton className="h-72 w-full" /> : <LeafletMap universities={universities} />}
    </div>
  )
}