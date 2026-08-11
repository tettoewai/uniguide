import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createMajor, updateMajor, deleteMajor } from '@/app/actions/admin'

export default async function AdminMajorsPage() {
  const majors = await prisma.major.findMany({ orderBy: { name: 'asc' } })

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage majors
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Configure the fields of study that map to university programs.
        </p>
      </div>

      <CatalogAdmin
        kind="Major"
        subtitle="Add a major that universities and students can link to."
        items={majors.map((m) => ({ id: m.id, name: m.name }))}
        onCreate={createMajor}
        onUpdate={updateMajor}
        onDelete={deleteMajor}
      />
    </>
  )
}
