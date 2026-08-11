import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createHobby, updateHobby, deleteHobby } from '@/app/actions/admin'

export default async function AdminHobbiesPage() {
  const hobbies = await prisma.hobby.findMany({ orderBy: { name: 'asc' } })

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage hobbies
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Configure the hobbies used to match students to majors.
        </p>
      </div>

      <CatalogAdmin
        kind="Hobby"
        subtitle="Add a hobby with an optional icon key and color."
        showColor
        items={hobbies.map((h) => ({ id: h.id, name: h.name, color: h.color }))}
        onCreate={createHobby}
        onUpdate={updateHobby}
        onDelete={deleteHobby}
      />
    </>
  )
}
