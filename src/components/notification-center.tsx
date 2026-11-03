import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, Check, ClipboardCheck, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AppNotification } from '@/lib/notifications-data'
import { cn } from '@/lib/utils'

const notificationIcon = { Critical: AlertTriangle, Assignment: ClipboardCheck, System: Info }
const notificationTone = { Critical: 'bg-red-50 text-red-600', Assignment: 'bg-sky-50 text-sky-600', System: 'bg-slate-100 text-slate-600' }

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications])

  const markRead = (id: string) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification))
  const markAllRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))

  return <div className="relative">
    <Button variant="ghost" size="icon" className="relative text-slate-500" aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`} onClick={() => setOpen((current) => !current)}><Bell className="h-5 w-5" />{unreadCount > 0 && <span className="absolute right-2 top-2 flex h-1.5 min-w-1.5 rounded-full bg-orange-500 ring-2 ring-white" />}</Button>
    {open && <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}><div role="dialog" aria-label="Notification center" className="absolute right-4 top-[68px] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-white shadow-2xl md:right-8" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b px-4 py-4"><div><h2 className="font-semibold text-slate-900">Notifications</h2><p className="mt-0.5 text-xs text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}</p></div><div className="flex items-center gap-1">{unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllRead}><Check className="mr-1.5 h-3.5 w-3.5" />Mark all as read</Button>}<Button variant="ghost" size="icon" aria-label="Close notifications" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button></div></div><div className="max-h-[360px] overflow-y-auto">{notifications.map((notification) => { const Icon = notificationIcon[notification.type]; return <div key={notification.id} className={cn('flex gap-3 border-b px-4 py-4 last:border-b-0', !notification.read && 'bg-orange-50/40')}><div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', notificationTone[notification.type])}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-slate-800">{notification.title}</p>{!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{notification.message}</p><div className="mt-2 flex items-center justify-between"><span className="text-[11px] text-slate-400">{notification.time}</span>{!notification.read && <button type="button" className="text-[11px] font-semibold text-orange-600 hover:text-orange-700" onClick={() => markRead(notification.id)}>Mark as read</button>}</div></div></div> })}</div></div></div>}
  </div>
}
