import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { AdminNav } from '@/components/admin/AdminNav'
import { CatalogAdmin } from '@/components/admin/CatalogAdmin'
import { createSubject, updateSubject, deleteSubject } from '@/app/actions/admin'

export default async function AdminSubjectsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Manage subjects
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Configure the Grade 12 subjects students use to record their marks.
        </p>
      </div>

      <AdminNav />

      <CatalogAdmin
        kind="Subject"
        subtitle="Add a subject students can record marks for."
        items={subjects.map((s) => ({ id: s.id, name: s.name }))}
        onCreate={createSubject}
        onUpdate={updateSubject}
        onDelete={deleteSubject}
      />
    </div>
  )
}