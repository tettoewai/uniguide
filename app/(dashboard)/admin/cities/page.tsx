import { prisma } from '@/lib/db'
import { CityAdmin } from '@/components/admin/CityAdmin'
import { createCity, updateCity, deleteCity } from '@/app/actions/admin'
import { getDictionary } from '@/lib/i18n/server'

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } })
  const dict = await getDictionary()
  const strings = dict.admin.cities

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {strings.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {strings.subtitle}
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
