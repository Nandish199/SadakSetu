import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { AUTH_SESSION_LIFETIME_LABEL } from '@/lib/auth'
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, SHOW_DEMO_ADMIN_CREDENTIALS } from '@/lib/api-config'

type FormErrors = { email?: string; password?: string }

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const wasExpired = Boolean((location.state as { reason?: string } | null)?.reason === 'expired')
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const submitCredentials = async (nextEmail: string, nextPassword: string) => {
    setFormError('')
    setSubmitting(true)
    const result = await login(nextEmail, nextPassword)
    setSubmitting(false)
    if (result.ok === false) {
      setFormError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  const handleDemoLogin = async () => {
    setEmail(DEMO_ADMIN_EMAIL)
    setPassword(DEMO_ADMIN_PASSWORD)
    setErrors({})
    await submitCredentials(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD)
  }

  useEffect(() => {
    if (wasExpired) window.history.replaceState({}, document.title, '/login')
  }, [wasExpired])

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    await submitCredentials(email, password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101b33] px-4 py-10 sm:px-6">
      <div className="absolute left-6 top-6 sm:left-10 sm:top-8"><Brand /></div>
      <div className="w-full max-w-md pt-14">
        <Card className="border-white/10 shadow-2xl shadow-slate-950/30">
          <CardHeader className="space-y-4 p-6 pb-4 sm:p-8 sm:pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><ShieldCheck className="h-6 w-6" /></div>
            <div><CardTitle className="text-2xl">Admin sign in</CardTitle><CardDescription className="mt-2">Access the SadakSetu road safety operations console.</CardDescription></div>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
            {SHOW_DEMO_ADMIN_CREDENTIALS && <div className="mb-5 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">
              <p className="font-bold">Demo administrator credentials</p>
              <p className="mt-1 text-xs text-orange-800">Development-only local demo values.</p>
              <dl className="mt-3 space-y-2">
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-orange-700">Demo user</dt><dd className="text-xs">Administrator</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-orange-700">User ID</dt><dd className="break-all font-mono text-xs">{DEMO_ADMIN_EMAIL}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-orange-700">Password</dt><dd className="break-all font-mono text-xs">{DEMO_ADMIN_PASSWORD}</dd></div>
              </dl>
              <Button type="button" variant="outline" size="sm" className="mt-3 border-orange-300 bg-white" onClick={handleDemoLogin} disabled={submitting}>{submitting ? 'Signing in...' : 'Demo login'}</Button>
            </div>}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2"><label className="text-sm font-semibold text-slate-700" htmlFor="email">Work email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input id="email" type="email" autoComplete="username" placeholder="you@organization.gov.in" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} className="pl-9" />{errors.email && <p className="text-xs font-medium text-red-600">{errors.email}</p>}</div></div>
              <div className="space-y-2"><label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} className="pl-9 pr-11" /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>{errors.password && <p className="text-xs font-medium text-red-600">{errors.password}</p>}</div></div>
              {(formError || wasExpired) && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{wasExpired && !formError ? 'Your session expired. Please sign in again.' : formError}</p>}
              <Button type="submit" disabled={submitting} className="h-11 w-full bg-orange-500 hover:bg-orange-600">{submitting ? 'Signing in...' : 'Sign in to dashboard'}</Button>
            </form>
            <p className="mt-5 text-center text-xs text-muted-foreground">Sessions expire after {AUTH_SESSION_LIFETIME_LABEL} or 30 minutes of inactivity.</p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-slate-500">SadakSetu Admin Console · Secure municipal operations</p>
      </div>
    </main>
  )
}
