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
import { useLocale } from '@/components/providers/locale-provider'
import { format } from '@/lib/i18n/config'

type KindKey = 'subject' | 'major' | 'hobby'

type Item = { id: string; name: string; color?: string | null }

const inputClass =
  'h-12 rounded-md border-0 bg-background/80 ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-sky-300'

export function CatalogAdmin({
  kindKey,
  subtitle,
  items,
  showColor,
  onCreate,
  onUpdate,
  onDelete,
}: {
  kindKey: KindKey
  subtitle: string
  items: Item[]
  showColor?: boolean
  onCreate: (prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>
  onUpdate: (id: string, prev: { error?: string }, fd: FormData) => Promise<{ error?: string }>
  onDelete: (id: string) => Promise<{ error?: string }>
}) {
  const router = useRouter()
  const { dict } = useLocale()
  const cat = dict.admin.catalog
  const kindTitle = dict.admin.kinds[kindKey]
  const kind = kindTitle.toLowerCase()
  const kindPlural = dict.admin.kindsPlural[kindKey].toLowerCase()
  const namePlaceholderKeys = {
    subject: 'namePlaceholderSubject',
    major: 'namePlaceholderMajor',
    hobby: 'namePlaceholderHobby',
  } as const
  const namePlaceholder = cat[namePlaceholderKeys[kindKey]]

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
        toast.success(format(cat.deleted, { name }))
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
        toast.success(editing ? format(cat.updated, { kind: kindTitle }) : format(cat.created, { kind: kindTitle }))
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={cat.searchPlaceholder}
            className={cn(inputClass, 'pl-11')}
            aria-label={format(cat.searchAria, { kind: kindPlural })}
          />
        </div>
        <Button
          onClick={openCreate}
          className="h-12 rounded-full bg-primary px-8 hover:bg-sky-600"
        >
          <Plus className="mr-1.5 size-4" />
          {format(cat.add, { kind })}
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 text-muted-foreground">{cat.nameCol}</TableHead>
              {showColor ? <TableHead className="text-muted-foreground">{cat.colorCol}</TableHead> : null}
              <TableHead className="w-28 px-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showColor ? 3 : 2} className="px-5 py-16 text-center">
                  <p className="font-medium text-foreground">
                    {search
                      ? format(cat.noResultsSearchTitle, { kind: kindPlural })
                      : format(cat.noResultsTitle, { kind: kindPlural })}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {search ? cat.noResultsSearchBody : format(cat.noResultsBody, { kind })}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-sky-50/40">
                  <TableCell className="px-5 font-semibold text-foreground">{item.name}</TableCell>
                  {showColor ? (
                    <TableCell className="text-muted-foreground">
                      {item.color ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <span
                            className="inline-block size-3.5 rounded-full ring-1 ring-border"
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
                          aria-label={cat.cancelDeleteAria}
                          className="rounded-full text-muted-foreground"
                        >
                          <X className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDeleteItem(item.id, item.name)}
                          disabled={isPending}
                          aria-label={format(cat.confirmDeleteAria, { name: item.name })}
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
                          aria-label={format(cat.editAria, { name: item.name })}
                          className="rounded-full text-muted-foreground hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmId(item.id)}
                          disabled={isPending}
                          aria-label={format(cat.deleteAria, { name: item.name })}
                          className="rounded-full text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
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
              {editing ? format(cat.editTitle, { kind }) : format(cat.addTitle, { kind })}
            </DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          <form action={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{cat.nameRequired}</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={namePlaceholder}
                required
                className={inputClass}
              />
            </div>
            {showColor ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="icon">{cat.iconKey}</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder={cat.iconPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">{cat.colorOptional}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={color || '#0ea5e9'}
                      onChange={(e) => setColor(e.target.value)}
                      className="size-12 shrink-0 cursor-pointer rounded-md border-0 p-1 ring-1 ring-border"
                    />
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder={cat.colorPlaceholder}
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
                className="h-11 rounded-full border-border bg-background/70 px-6"
              >
                {dict.common.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 rounded-full bg-primary px-6 hover:bg-sky-600"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    {editing ? dict.common.saving : dict.common.creating}
                  </>
                ) : (
                  editing ? dict.common.saveChanges : format(cat.create, { kind })
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
