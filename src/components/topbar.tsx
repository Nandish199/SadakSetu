import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NotificationCenter } from '@/components/notification-center'
import { useAuth } from '@/hooks/use-auth'
import { Menu, Search } from 'lucide-react'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth()
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AD'
  return <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b bg-white/90 px-4 backdrop-blur md:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation"><Menu className="h-5 w-5" /></Button><div className="relative hidden w-72 sm:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search dashboard..." aria-label="Search dashboard" className="border-slate-200 bg-slate-50 pl-9" /></div></div><div className="flex items-center gap-3"><NotificationCenter /><div className="hidden h-6 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">{initials}</div><div className="hidden text-left sm:block"><p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Administrator'}</p><p className="text-[11px] text-slate-500">{user?.role ?? 'Administrator'}</p></div></div></div></header>
}
