export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><img src="/sadaksetu-logo.png" alt="SadakSetu logo" className={compact ? 'h-9 w-9 rounded-lg object-cover' : 'h-10 w-10 rounded-xl object-cover'} /><div><p className="text-[17px] font-bold tracking-tight text-white">Sadak<span className="text-orange-400">Setu</span></p>{!compact && <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Admin console</p>}</div></div>
}
