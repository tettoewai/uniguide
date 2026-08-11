import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { AdminNav } from '@/components/admin/AdminNav'
import { CityAdmin } from '@/components/admin/CityAdmin'
import { createCity, updateCity, deleteCity } from '@/app/actions/admin'

export default async function AdminCitiesPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage cities
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Configure the cities students can choose from and universities are located in.
        </p>
      </div>

      <AdminNav />

      <CityAdmin
        cities={cities.map((c) => ({
          id: c.id,
          name: c.name,
          latitude: c.latitude,
          longitude: c.longitude,
        }))}
        onCreate={createCity}
        onUpdate={updateCity}
        onDelete={deleteCity}
      />
    </div>
  )
}
