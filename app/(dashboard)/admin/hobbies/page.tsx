import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { AdminNav } from '@/components/admin/AdminNav'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createHobby, updateHobby, deleteHobby } from '@/app/actions/admin'

export default async function AdminHobbiesPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const hobbies = await prisma.hobby.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage hobbies
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Configure the hobbies used to match students to majors.
        </p>
      </div>

      <AdminNav />

      <CatalogAdmin
        kind="Hobby"
        subtitle="Add a hobby with an optional icon key and color."
        showColor
        items={hobbies.map((h) => ({ id: h.id, name: h.name, color: h.color }))}
        onCreate={createHobby}
        onUpdate={updateHobby}
        onDelete={deleteHobby}
      />
    </div>
  )
}