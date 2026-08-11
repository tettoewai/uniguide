import { prisma } from '@/lib/db'
import { CityAdmin } from '@/components/admin/CityAdmin'
import { createCity, updateCity, deleteCity } from '@/app/actions/admin'

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } })

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage cities
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Configure the cities students can choose from and universities are located in.
        </p>
      </div>

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
    </>
  )
}
