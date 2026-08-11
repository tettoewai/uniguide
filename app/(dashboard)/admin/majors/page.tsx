import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createMajor, updateMajor, deleteMajor } from '@/app/actions/admin'
import { getDictionary } from '@/lib/i18n/server'

export default async function AdminMajorsPage() {
  const majors = await prisma.major.findMany({ orderBy: { name: 'asc' } })
  const dict = await getDictionary()

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.admin.majors.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.admin.majors.subtitle}
        </p>
      </div>

      <CatalogAdmin
        kindKey="major"
        subtitle={dict.admin.majors.subtitle}
        items={majors.map((m) => ({ id: m.id, name: m.name }))}
        onCreate={createMajor}
        onUpdate={updateMajor}
        onDelete={deleteMajor}
      />
    </>
  )
}
