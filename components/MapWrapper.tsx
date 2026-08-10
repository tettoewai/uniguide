'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div className="overflow-hidden rounded-3xl border border-white/50 shadow-2xl shadow-sky-300/20">
      <div className="flex items-center justify-between gap-3 border-b border-white/50 bg-white/60 px-4 py-3 backdrop-blur-md">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
          <MapPinned className="size-4 text-sky-500" />
          Campus locations
        </span>
        {universities.length > 0 ? (
          <span className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-500">
            {universities.length} {universities.length === 1 ? 'university' : 'universities'}
          </span>
        ) : null}
      </div>
      {!mounted ? <Skeleton className="h-72 w-full" /> : <LeafletMap universities={universities} />}
    </div>
  )
}