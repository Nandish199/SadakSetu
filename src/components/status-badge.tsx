import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusClasses = { Open: 'border-red-200 bg-red-50 text-red-700', 'In progress': 'border-amber-200 bg-amber-50 text-amber-700', Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700' }

export function StatusBadge({ status }: { status: keyof typeof statusClasses }) {
  return <Badge variant="outline" className={cn('font-medium', statusClasses[status])}>{status}</Badge>
}
