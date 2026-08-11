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

type City = { id: string; name: string; latitude: number | null; longitude: number | null }

const inputClass =
  'h-12 rounded-md border-0 bg-white/80 ring-1 ring-zinc-200/70 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-300'

export function CityAdmin({
  cities,
  onCreate,
  onUpdate,
  onDelete,
}: {
  cities: City[]
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
  const [editing, setEditing] = useState<City | null>(null)

  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const resetForm = () => {
    setName('')
    setLatitude('')
    setLongitude('')
    setFormError(null)
  }

  const openCreate = () => {
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  const openEdit = (city: City) => {
    setEditing(city)
    setName(city.name)
    setLatitude(city.latitude !== null ? String(city.latitude) : '')
    setLongitude(city.longitude !== null ? String(city.longitude) : '')
    setFormError(null)
    setOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return cities
    return cities.filter((c) => c.name.toLowerCase().includes(q))
  }, [search, cities])

  const onDeleteItem = (id: string, cityName: string) => {
    startTransition(async () => {
      const res = await onDelete(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`"${cityName}" deleted`)
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
        toast.success(editing ? 'City updated' : 'City created')
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
            aria-label="Search cities"
          />
        </div>
        <Button
          onClick={openCreate}
          className="h-12 rounded-full bg-primary px-8 shadow-lg shadow-sky-300/60 hover:bg-sky-600"
        >
          <Plus className="mr-1.5 size-4" />
          Add city
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Latitude</TableHead>
              <TableHead className="text-zinc-400">Longitude</TableHead>
              <TableHead className="w-28 px-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="px-5 py-16 text-center">
                  <p className="font-medium text-zinc-600">
                    {search ? 'No cities match your search.' : 'No cities yet.'}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {search ? 'Try a different name.' : 'Add your first city.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((city) => (
                <TableRow key={city.id} className="hover:bg-sky-50/40">
                  <TableCell className="px-5 font-semibold text-zinc-800">{city.name}</TableCell>
                  <TableCell className="tabular-nums text-zinc-500">
                    {city.latitude !== null ? city.latitude.toFixed(4) : '—'}
                  </TableCell>
                  <TableCell className="tabular-nums text-zinc-500">
                    {city.longitude !== null ? city.longitude.toFixed(4) : '—'}
                  </TableCell>
                  <TableCell className="px-5">
                    {confirmId === city.id ? (
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
                          onClick={() => onDeleteItem(city.id, city.name)}
                          disabled={isPending}
                          aria-label={`Confirm delete ${city.name}`}
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
                          onClick={() => openEdit(city)}
                          disabled={isPending}
                          aria-label={`Edit ${city.name}`}
                          className="rounded-full text-zinc-400 hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setConfirmId(city.id)}
                          disabled={isPending}
                          aria-label={`Delete ${city.name}`}
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
              {editing ? 'Edit city' : 'Add a city'}
            </DialogTitle>
            <DialogDescription>
              {editing ? 'Update the city details.' : 'Add a new city for students and universities.'}
            </DialogDescription>
          </DialogHeader>
          <form action={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="city-name">Name *</Label>
              <Input
                id="city-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yangon"
                required
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city-latitude">Latitude (optional)</Label>
                <Input
                  id="city-latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 16.8661"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city-longitude">Longitude (optional)</Label>
                <Input
                  id="city-longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 96.1951"
                  className={inputClass}
                />
              </div>
            </div>

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
                  editing ? 'Save changes' : 'Create city'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
