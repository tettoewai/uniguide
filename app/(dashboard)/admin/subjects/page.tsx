import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createSubject, updateSubject, deleteSubject } from '@/app/actions/admin'
import { getDictionary } from '@/lib/i18n/server'

export default async function AdminSubjectsPage() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
  const dict = await getDictionary()

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {dict.admin.subjects.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          {dict.admin.subjects.subtitle}
        </p>
      </div>

      <CatalogAdmin
        kindKey="subject"
        subtitle={dict.admin.subjects.subtitle}
        items={subjects.map((s) => ({ id: s.id, name: s.name }))}
        onCreate={createSubject}
        onUpdate={updateSubject}
        onDelete={deleteSubject}
      />
    </>
  )
}
