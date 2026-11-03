import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Edit3, Mail, MapPin, Phone, Search, ShieldCheck, UserRound, UserX, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type UserProfile, type UserRole, type UserStatus } from '@/lib/users-data'
import { cn } from '@/lib/utils'
import { userService } from '@/services/user-service'

const statusClasses: Record<UserStatus, string> = { Active: 'border-emerald-200 bg-emerald-50 text-emerald-700', Inactive: 'border-slate-200 bg-slate-100 text-slate-600' }
const roleClasses: Record<UserRole, string> = { Citizen: 'border-slate-200 bg-slate-50 text-slate-600', 'Field reporter': 'border-sky-200 bg-sky-50 text-sky-700', Administrator: 'border-orange-200 bg-orange-50 text-orange-700' }
const emptyForm = { name: '', email: '', phone: '', area: '', role: 'Citizen' as UserRole }

function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge variant="outline" className={cn('font-medium', statusClasses[status])}><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />{status}</Badge>
}

function UserRoleBadge({ role }: { role: UserRole }) {
  return <Badge variant="outline" className={cn('font-medium', roleClasses[role])}>{role}</Badge>
}

export function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const selected = users.find((user) => user.id === selectedId) ?? null

  useEffect(() => {
    userService.list().then(setUsers).catch((error: unknown) => setFormError(error instanceof Error ? error.message : 'Unable to load users.')).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const searchable = `${user.name} ${user.email} ${user.phone} ${user.area}`.toLowerCase()
      return searchable.includes(query) && (statusFilter === 'All statuses' || user.status === statusFilter) && (roleFilter === 'All roles' || user.role === roleFilter)
    })
  }, [roleFilter, search, statusFilter, users])

  const openEdit = (user: UserProfile) => {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email, phone: user.phone, area: user.area, role: user.role })
    setFormError('')
    setFormOpen(true)
  }

  const updateForm = (key: keyof typeof emptyForm, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const saveProfile = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.area.trim()) {
      setFormError('Name, email, phone, and area are required.')
      return
    }
    if (editingId) {
      setSaving(true)
      try {
        let saved = await userService.updateProfile(editingId, { full_name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), area: form.area.trim() })
        if (saved.role !== form.role) saved = await userService.updateRole(editingId, form.role)
        setUsers((current) => current.map((user) => user.id === editingId ? saved : user))
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Unable to save user profile.')
        return
      } finally { setSaving(false) }
    }
    setFormOpen(false)
  }

  const toggleStatus = async () => {
    if (!selected) return
    const nextStatus: UserStatus = selected.status === 'Active' ? 'Inactive' : 'Active'
    setSaving(true)
    try {
      const saved = await userService.updateStatus(selected.id, nextStatus === 'Active')
      setUsers((current) => current.map((user) => user.id === selected.id ? saved : user))
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to update user status.')
    } finally { setSaving(false) }
  }

  return <div>
    {loading && <p className="mb-4 text-sm text-muted-foreground">Loading users…</p>}
    {saving && <span className="sr-only">Saving user data…</span>}
    <PageHeader eyebrow="Community accounts" title="User management" description="Review citizen profiles, access status, and reporting activity." />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-sky-50 p-3 text-sky-600"><UserRound className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Total users</p></div></CardContent></Card>
      <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{users.filter((user) => user.status === 'Active').length}</p><p className="text-xs text-muted-foreground">Active accounts</p></div></CardContent></Card>
      <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-slate-100 p-3 text-slate-600"><UserX className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{users.filter((user) => user.status === 'Inactive').length}</p><p className="text-xs text-muted-foreground">Inactive accounts</p></div></CardContent></Card>
      <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-orange-50 p-3 text-orange-600"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{users.reduce((total, user) => total + user.complaintsSubmitted, 0)}</p><p className="text-xs text-muted-foreground">Reports submitted</p></div></CardContent></Card>
    </div>
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, email, phone, or area..." className="pl-9" /></div>
          <div className="flex flex-col gap-3 sm:flex-row"><select aria-label="User status filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"><option>All statuses</option><option>Active</option><option>Inactive</option></select><select aria-label="User role filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"><option>All roles</option><option>Citizen</option><option>Field reporter</option><option>Administrator</option></select></div>
        </div>
        <div className="hidden md:block"><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Area</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Reports</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{filtered.map((user) => <TableRow key={user.id}><TableCell><button type="button" className="flex items-center gap-3 text-left" aria-label={`View ${user.name}`} onClick={() => setSelectedId(user.id)}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#15213d] text-xs font-bold text-white">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><p className="font-semibold text-slate-800">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div></button></TableCell><TableCell><span className="flex items-center gap-1.5 text-sm text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" />{user.area}</span></TableCell><TableCell><UserRoleBadge role={user.role} /></TableCell><TableCell><UserStatusBadge status={user.status} /></TableCell><TableCell><span className="text-sm font-medium text-slate-700">{user.complaintsSubmitted}</span></TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => setSelectedId(user.id)}>View profile</Button></TableCell></TableRow>)}</TableBody></Table></div>
        <div className="divide-y md:hidden">{filtered.map((user) => <button type="button" key={user.id} className="flex w-full items-start justify-between gap-4 p-4 text-left" aria-label={`View ${user.name}`} onClick={() => setSelectedId(user.id)}><span className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#15213d] text-xs font-bold text-white">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="min-w-0"><span className="block truncate font-semibold text-slate-800">{user.name}</span><span className="block truncate text-xs text-muted-foreground">{user.email}</span><span className="mt-2 block text-xs text-slate-500">{user.area} · {user.complaintsSubmitted} reports</span></span></span><UserStatusBadge status={user.status} /></button>)}</div>
        {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No users match the current filters.</div>}
      </CardContent>
    </Card>
    {selected && <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/40" onClick={() => setSelectedId(null)}><aside role="dialog" aria-modal="true" aria-label={`${selected.name} profile`} className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between border-b px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">{selected.id}</p><h2 className="mt-2 text-xl font-bold text-slate-900">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.role}</p></div><Button variant="ghost" size="icon" onClick={() => setSelectedId(null)} aria-label="Close user profile"><X className="h-5 w-5" /></Button></div><div className="space-y-6 p-6"><div className="flex items-center justify-between"><UserStatusBadge status={selected.status} /><span className="text-xs text-muted-foreground">{selected.lastActive}</span></div><div className="rounded-xl border bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact information</p><div className="mt-4 space-y-3"><p className="flex items-center gap-3 text-sm text-slate-600"><Mail className="h-4 w-4 text-slate-400" />{selected.email}</p><p className="flex items-center gap-3 text-sm text-slate-600"><Phone className="h-4 w-4 text-slate-400" />{selected.phone}</p><p className="flex items-center gap-3 text-sm text-slate-600"><MapPin className="h-4 w-4 text-slate-400" />{selected.area}</p></div></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Reports submitted</p><p className="mt-1 text-2xl font-bold text-slate-900">{selected.complaintsSubmitted}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Joined</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800"><CalendarDays className="h-4 w-4 text-slate-400" />{selected.joinedAt}</p></div></div><div className="border-t pt-5"><p className="mb-3 text-sm font-semibold text-slate-800">User management actions</p><div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" className="flex-1 gap-2" onClick={() => openEdit(selected)}><Edit3 className="h-4 w-4" />Edit profile</Button><Button variant={selected.status === 'Active' ? 'destructive' : 'default'} className="flex-1 gap-2" onClick={toggleStatus}>{selected.status === 'Active' ? <UserX className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{selected.status === 'Active' ? 'Deactivate user' : 'Activate user'}</Button></div></div></div></aside></div>}
    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setFormOpen(false)}><div role="dialog" aria-modal="true" aria-label="Edit user profile" className="w-full max-w-lg rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between border-b px-6 py-5"><div><h2 className="text-xl font-bold text-slate-900">Edit user profile</h2><p className="mt-1 text-sm text-muted-foreground">Update contact details and access role.</p></div><Button variant="ghost" size="icon" onClick={() => setFormOpen(false)} aria-label="Close user form"><X className="h-5 w-5" /></Button></div><div className="grid gap-4 p-6 sm:grid-cols-2"><label className="space-y-2 text-sm font-semibold text-slate-700 sm:col-span-2">Full name<Input aria-label="User name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} /></label><label className="space-y-2 text-sm font-semibold text-slate-700">Email<Input aria-label="User email" type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} /></label><label className="space-y-2 text-sm font-semibold text-slate-700">Phone<Input aria-label="User phone" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} /></label><label className="space-y-2 text-sm font-semibold text-slate-700">Area<Input aria-label="User area" value={form.area} onChange={(event) => updateForm('area', event.target.value)} /></label><label className="space-y-2 text-sm font-semibold text-slate-700">Role<select aria-label="User role" value={form.role} onChange={(event) => updateForm('role', event.target.value as UserRole)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none"><option>Citizen</option><option>Field reporter</option><option>Administrator</option></select></label>{formError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">{formError}</p>}<div className="flex justify-end gap-2 sm:col-span-2"><Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button><Button className="bg-orange-500 hover:bg-orange-600" onClick={saveProfile}>Save changes</Button></div></div></div></div>}
  </div>
}
