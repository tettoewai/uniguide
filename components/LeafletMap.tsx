'use client'

import Link from 'next/link'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { MapUniversity } from './MapWrapper'

const uniguideIcon = L.divIcon({
  className: 'uniguide-marker-wrap bg-none border-0',
  html: '<span class="uniguide-marker"><span class="marker-ping"></span><span class="marker-core"></span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
})

export default function LeafletMap({ universities }: { universities: MapUniversity[] }) {
  const center: [number, number] =
    universities.length > 0
      ? [universities[0].latitude, universities[0].longitude]
      : [21.9162, 95.956]

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={false}
      className="z-0 h-72 w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {universities.map((uni) => (
        <Marker key={uni.id} position={[uni.latitude, uni.longitude]} icon={uniguideIcon}>
          <Popup>
            <div className="space-y-1">
              <p className="font-medium">{uni.name}</p>
              <p className="text-xs text-muted-foreground">Fit score: {Math.round(uni.score * 100)}%</p>
              <Link
                href={`/universities/${uni.id}`}
                className="text-xs font-medium text-primary underline underline-offset-2"
              >
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}