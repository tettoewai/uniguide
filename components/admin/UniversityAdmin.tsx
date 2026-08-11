'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Check, X, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { createUniversity, updateUniversity, deleteUniversity } from '@/app/actions/admin'

type Row = {
  id: string
  name: string
  cityId: string
  annualFee: number | null
  totalMarkRequired: number | null
  majors: string
  majorIds: string[]
  subjectReqs: Record<string, number>
  favorites: number
  reviews: number
}

type Option = { id: string; name: string }

const inputClass =
  'h-12 rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300'

const chipClass = (active: boolean) =>
  cn(
    'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
    active
      ? 'border-transparent bg-primary text-primary-foreground shadow-lg shadow-sky-300/50'
      : 'border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-sky-200 hover:text-sky-600',
  )

export function UniversityAdmin({
  universities,
  majors,
  subjects,
  cities,
}: {
  universities: Row[]
  majors: Option[]
  subjects: Option[]
  cities: Option[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [cityId, setCityId] = useState('')
  const [annualFee, setAnnualFee] = useState('')
  const [totalMarkRequired, setTotalMarkRequired] = useState('')
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [subjectReqs, setSubjectReqs] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const hasAverage = totalMarkRequired.trim() !== ''
  const hasSubjectMarks = Object.values(subjectReqs).some((v) => v.trim() !== '')

  const resetForm = () => {
    setName('')
    setCityId('')
    setAnnualFee('')
    setTotalMarkRequired('')
    setSelectedMajors([])
    setSubjectReqs({})
    setFormError(null)
    setEditingId(null)
  }

  const openCreate = () => {
    resetForm()
    setOpen(true)
  }

  const openEdit = (u: Row) => {
    setEditingId(u.id)
    setName(u.name)
    setCityId(u.cityId)
    setAnnualFee(u.annualFee === null ? '' : String(u.annualFee))
    setTotalMarkRequired(u.totalMarkRequired === null ? '' : String(u.totalMarkRequired))
    setSelectedMajors(u.majorIds)
    setSubjectReqs(
      Object.fromEntries(Object.entries(u.subjectReqs).map(([k, v]) => [k, String(v)])),
    )
    setFormError(null)
    setOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return universities
    return universities.filter(
      (u) => u.name.toLowerCase().includes(q) || cities.find(c => c.id === u.cityId)?.name.toLowerCase().includes(q),
    )
  }, [search, universities, cities])

  const onDelete = (id: string, uniName: string) => {
    startTransition(async () => {
      const res = await deleteUniversity(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`"${uniName}" deleted`)
        setConfirmId(null)
        router.refresh()
      }
    })
  }

  const onCreate = async (fd: FormData) => {
    startTransition(async () => {
      const res = editingId
        ? await updateUniversity(editingId, {}, fd)
        : await createUniversity({}, fd)
      if (res.error) {
        setFormError(res.error)
      } else {
        setOpen(false)
        resetForm()
        toast.success(editingId ? 'University updated' : 'University created')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or city..."
            className={cn(inputClass, 'pl-11')}
            aria-label="Search universities"
          />
        </div>
        <Button
          onClick={openCreate}
          className="h-12 rounded-full bg-primary px-8 shadow-lg shadow-sky-300/60 hover:bg-sky-600"
        >
          <Plus className="mr-1.5 size-4" />
          Add university
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">City</TableHead>
              <TableHead className="text-zinc-400">Annual fee</TableHead>
              <TableHead className="text-zinc-400">Min avg</TableHead>
              <TableHead className="text-zinc-400">Majors</TableHead>
              <TableHead className="text-zinc-400">Fav / Rev</TableHead>
              <TableHead className="w-28 px-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-16 text-center">
                  <p className="font-medium text-zinc-600">
                    {search ? 'No universities match your search.' : 'No universities yet.'}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {search
                      ? 'Try a different name or city.'
                      : 'Add your first university to get started.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id} className="hover:bg-sky-50/40">
                  <TableCell className="px-5 font-semibold text-zinc-800">{u.name}</TableCell>
                  <TableCell className="text-zinc-500">{cities.find(c => c.id === u.cityId)?.name ?? '—'}</TableCell>
                  <TableCell className="tabular-nums text-zinc-600">
                    {u.annualFee ? `${u.annualFee.toLocaleString()} MMK` : '—'}
                  </TableCell>
                  <TableCell className="tabular-nums text-zinc-600">
                    {u.totalMarkRequired ? (
                      <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
                        {u.totalMarkRequired}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="max-w-56 truncate text-zinc-500">{u.majors || '—'}</TableCell>
                  <TableCell className="text-zinc-500">
                    {u.favorites} / {u.reviews}
                  </TableCell>
                  <TableCell className="px-5">
                    {confirmId === u.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmId(null)}
                          aria-label="Cancel delete"
                          className="rounded-full text-zinc-400"
                        >
                          <X className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(u.id, u.name)}
                          disabled={isPending}
                          aria-label={`Confirm delete ${u.name}`}
                          className="rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          {isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(u)}
                          disabled={isPending}
                          aria-label={`Edit ${u.name}`}
                          className="rounded-full text-zinc-400 hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmId(u.id)}
                          disabled={isPending}
                          aria-label={`Delete ${u.name}`}
                          className="rounded-full text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold tracking-tight">
              {editingId ? 'Edit university' : 'Add a university'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details. Majors and subject requirements are optional.
            </DialogDescription>
          </DialogHeader>
          <form action={onCreate} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <select
                  id="city"
                  name="city"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  required
                  className={cn(inputClass, 'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10', !cityId && 'text-zinc-400')}
                >
                  <option value="" disabled>
                    Select a city
                  </option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="annualFee">Annual fee (MMK)</Label>
                <Input
                  id="annualFee"
                  name="annualFee"
                  type="number"
                  min={0}
                  value={annualFee}
                  onChange={(e) => setAnnualFee(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarkRequired">Overall average required</Label>
                <Input
                  id="totalMarkRequired"
                  name="totalMarkRequired"
                  type="number"
                  min={0}
                  value={totalMarkRequired}
                  disabled={hasSubjectMarks}
                  onChange={(e) => {
                    setTotalMarkRequired(e.target.value)
                    if (e.target.value !== '') setSubjectReqs({})
                  }}
                  className={cn(inputClass, hasSubjectMarks && 'opacity-50')}
                />
                {hasSubjectMarks ? (
                  <p className="text-xs text-zinc-500">
                    Clear subject marks to set an overall average.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Majors</Label>
              <div className="flex flex-wrap gap-2">
                {majors.map((m) => {
                  const active = selectedMajors.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setSelectedMajors((prev) =>
                          active ? prev.filter((x) => x !== m.id) : [...prev, m.id],
                        )
                      }
                      className={chipClass(active)}
                    >
                      {m.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subject minimum marks</Label>
              {hasAverage ? (
                <p className="text-xs text-zinc-500">
                  Subject marks are disabled because an overall average is set.
                </p>
              ) : null}
              <div className={cn('grid gap-2 sm:grid-cols-2', hasAverage && 'opacity-50')}>
                {subjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 rounded-2xl bg-white/50 py-2 pl-4 pr-2 ring-1 ring-zinc-200/60"
                  >
                    <span className="flex-1 text-sm text-zinc-600">{s.name}</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="min"
                      disabled={hasAverage}
                      className="h-9 w-16 rounded-md border-0 bg-white/80 text-center ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300"
                      name={`subjectReq-${s.id}`}
                      value={subjectReqs[s.id] ?? ''}
                      onChange={(e) => {
                        setSubjectReqs((prev) => ({ ...prev, [s.id]: e.target.value }))
                        if (e.target.value !== '') setTotalMarkRequired('')
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {selectedMajors.map((id) => (
              <input key={id} type="hidden" name="majorIds" value={id} />
            ))}

            {formError ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{formError}</p>
            ) : null}

            <DialogFooter className="rounded-b-3xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full border-white/50 bg-white/70 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 rounded-full bg-primary px-6 shadow-lg shadow-sky-300/60 hover:bg-sky-600"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    {editingId ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  editingId ? 'Save changes' : 'Create university'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}