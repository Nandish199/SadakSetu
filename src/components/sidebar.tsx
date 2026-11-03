import { NavLink } from 'react-router-dom'
import { BarChart3, CircleHelp, FileWarning, LayoutDashboard, LogOut, Map, ScanSearch, Settings, Users, UsersRound, Waypoints } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand } from '@/components/brand'
import { useAuth } from '@/hooks/use-auth'

const primaryLinks = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Incidents', to: '/incidents', icon: FileWarning },
  { label: 'Road network', to: '/roads', icon: Waypoints },
  { label: 'Users', to: '/citizens', icon: Users },
]

const insightLinks = [
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Live map', to: '/map', icon: Map },
  { label: 'AI detection', to: '/ai-detection', icon: ScanSearch },
  { label: 'Repair teams', to: '/teams', icon: UsersRound },
]

type SidebarProps = { mobile?: boolean; onNavigate?: () => void }

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth()
  const linkClass = ({ isActive }: { isActive: boolean }) => cn('group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-100')
  return <aside className={cn('flex w-[248px] flex-col bg-[#101b33] text-white', mobile ? 'h-full' : 'fixed inset-y-0 left-0 z-30 hidden lg:flex')}><div className="flex h-[76px] items-center px-6"><Brand /></div><div className="mx-4 h-px bg-white/[0.08]" /><div className="flex flex-1 flex-col px-4 py-6"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p><nav className="space-y-1">{primaryLinks.map((item) => <NavLink key={item.to} to={item.to} className={linkClass} onClick={onNavigate}><item.icon className="h-[18px] w-[18px]" />{item.label}</NavLink>)}</nav><p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Insights</p><nav className="space-y-1">{insightLinks.map((item) => <NavLink key={item.to} to={item.to} className={linkClass} onClick={onNavigate}><item.icon className="h-[18px] w-[18px]" />{item.label}</NavLink>)}</nav><div className="mt-auto space-y-1"><NavLink to="/settings" className={linkClass} onClick={onNavigate}><Settings className="h-[18px] w-[18px]" />Settings</NavLink><div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">AK</div><span><span className="block text-sm font-semibold text-slate-100">{user?.name ?? 'Admin'}</span><span className="block text-[11px] text-slate-500">{user?.role ?? 'Administrator'}</span></span></div><button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100" onClick={() => logout()}><LogOut className="h-[18px] w-[18px]" />Sign out</button></div></div><div className="border-t border-white/[0.08] px-7 py-5"><div className="flex items-center gap-2 text-xs text-slate-500"><CircleHelp className="h-4 w-4" />Need help? <span className="font-semibold text-slate-300">Contact support</span></div></div></aside>
}
