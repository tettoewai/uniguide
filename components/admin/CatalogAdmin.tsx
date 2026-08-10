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

type Item = { id: string; name: string; color?: string | null }

const inputClass =
  'h-12 rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300'

export function CatalogAdmin({
  kind,
  subtitle,
  items,
  showColor,
  onCreate,
  onUpdate,
  onDelete,
}: {
  kind: string
  subtitle: string
  items: Item[]
  showColor?: boolean
  onCreate: (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>
  onUpdate: (id: string, prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>
  onDelete: (id: string) => Promise<{ error?: string }>
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Item | null>(null)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState('')

  const resetForm = () => {
    setName('')
    setIcon('')
    setColor('')
    setFormError(null)
  }

  const openCreate = () => {
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  const openEdit = (item: Item) => {
    setEditing(item)
    setName(item.name)
    setIcon('')
    setColor(item.color ?? '')
    setFormError(null)
    setOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.name.toLowerCase().includes(q))
  }, [search, items])

  const onDeleteItem = (id: string, name: string) => {
    startTransition(async () => {
      const res = await onDelete(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`"${name}" deleted`)
        setConfirmId(null)
        router.refresh()
      }
    })
  }

  const onSubmit = async (fd: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await onUpdate(editing.id, {}, fd)
        : await onCreate({}, fd)
      if (res.error) {
        setFormError(res.error)
      } else {
        setOpen(false)
        resetForm()
        toast.success(editing ? `${kind} updated` : `${kind} created`)
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
            placeholder="Search by name..."
            className={cn(inputClass, 'pl-11')}
            aria-label={`Search ${kind.toLowerCase()}s`}
          />
        </div>
        <Button
          onClick={openCreate}
          className="h-12 rounded-full bg-primary px-8 shadow-lg shadow-sky-300/60 hover:bg-sky-600"
        >
          <Plus className="mr-1.5 size-4" />
          Add {kind.toLowerCase()}
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 text-zinc-400">Name</TableHead>
              {showColor ? <TableHead className="text-zinc-400">Color</TableHead> : null}
              <TableHead className="w-28 px-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showColor ? 3 : 2} className="px-5 py-16 text-center">
                  <p className="font-medium text-zinc-600">
                    {search
                      ? `No ${kind.toLowerCase()}s match your search.`
                      : `No ${kind.toLowerCase()}s yet.`}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {search ? 'Try a different name.' : `Add your first ${kind.toLowerCase()}.`}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-sky-50/40">
                  <TableCell className="px-5 font-semibold text-zinc-800">{item.name}</TableCell>
                  {showColor ? (
                    <TableCell className="text-zinc-500">
                      {item.color ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <span
                            className="inline-block size-3.5 rounded-full ring-1 ring-zinc-200"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.color}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  ) : null}
                  <TableCell className="px-5">
                    {confirmId === item.id ? (
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
                          onClick={() => onDeleteItem(item.id, item.name)}
                          disabled={isPending}
                          aria-label={`Confirm delete ${item.name}`}
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
                          onClick={() => openEdit(item)}
                          disabled={isPending}
                          aria-label={`Edit ${item.name}`}
                          className="rounded-full text-zinc-400 hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmId(item.id)}
                          disabled={isPending}
                          aria-label={`Delete ${item.name}`}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold tracking-tight">
              {editing ? `Edit ${kind.toLowerCase()}` : `Add a ${kind.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <form action={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g. ${kind === 'Major' ? 'Computer Science' : kind === 'Hobby' ? 'Reading' : 'Geography'}`}
                required
                className={inputClass}
              />
            </div>
            {showColor ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon key (optional)</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. hobby-reading"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={color || '#0ea5e9'}
                      onChange={(e) => setColor(e.target.value)}
                      className="size-12 shrink-0 cursor-pointer rounded-md border-0 p-1 ring-1 ring-zinc-200/70"
                    />
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#0ea5e9"
                      className={cn(inputClass, '!h-12')}
                    />
                  </div>
                </div>
              </div>
            ) : null}

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
                    {editing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  editing ? `Save changes` : `Create ${kind.toLowerCase()}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}