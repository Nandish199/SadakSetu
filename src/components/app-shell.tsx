import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="min-h-screen bg-[#f7f8fb]"><Sidebar />{mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)}><div className="h-full w-[248px]" onClick={(event) => event.stopPropagation()}><div className="flex justify-end bg-[#101b33] px-4 pt-4"><button className="text-slate-300" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button></div><Sidebar mobile onNavigate={() => setMobileOpen(false)} /></div></div>}<div className="print-shell lg:pl-[248px]"><Topbar onMenuClick={() => setMobileOpen(true)} /><main className="mx-auto max-w-[1600px] p-4 md:p-8"><Outlet /></main></div></div>
}
