import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { AdminNav } from '@/components/admin/AdminNav'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createMajor, updateMajor, deleteMajor } from '@/app/actions/admin'

export default async function AdminMajorsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const majors = await prisma.major.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage majors
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Configure the fields of study that map to university programs.
        </p>
      </div>

      <AdminNav />

      <CatalogAdmin
        kind="Major"
        subtitle="Add a major that universities and students can link to."
        items={majors.map((m) => ({ id: m.id, name: m.name }))}
        onCreate={createMajor}
        onUpdate={updateMajor}
        onDelete={deleteMajor}
      />
    </div>
  )
}