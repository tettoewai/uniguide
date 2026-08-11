import { prisma } from '@/lib/db'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createSubject, updateSubject, deleteSubject } from '@/app/actions/admin'

export default async function AdminSubjectsPage() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })

  return (
    <>
      <div>
        <h1 className="text-primary font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage subjects
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Configure the Grade 12 subjects students use to record their marks.
        </p>
      </div>

      <CatalogAdmin
        kind="Subject"
        subtitle="Add a subject students can record marks for."
        items={subjects.map((s) => ({ id: s.id, name: s.name }))}
        onCreate={createSubject}
        onUpdate={updateSubject}
        onDelete={deleteSubject}
      />
    </>
  )
}
