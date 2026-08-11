import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createHobby, updateHobby, deleteHobby } from '@/app/actions/admin'
import { getDictionary } from '@/lib/i18n/server'

export default async function AdminHobbiesPage() {
  const hobbies = await prisma.hobby.findMany({ orderBy: { name: 'asc' } })
  const dict = await getDictionary()

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.admin.hobbies.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.admin.hobbies.subtitle}
        </p>
      </div>

      <CatalogAdmin
        kindKey="hobby"
        subtitle={dict.admin.hobbies.subtitle}
        showColor
        items={hobbies.map((h) => ({ id: h.id, name: h.name, color: h.color }))}
        onCreate={createHobby}
        onUpdate={updateHobby}
        onDelete={deleteHobby}
      />
    </>
  )
}
