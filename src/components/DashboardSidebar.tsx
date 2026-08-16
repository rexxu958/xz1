import Link from 'next/link'
import { useRouter } from 'next/router'

export default function DashboardSidebar(){
  const r = useRouter()
  const items = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/tools', label: 'Tools' },
    { href: '/dashboard/upload', label: 'Upload' },
    { href: '/dashboard/files', label: 'Files' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/activity', label: 'Activity' },
    { href: '/dashboard/maintenance', label: 'Maintenance' },
    { href: '/dashboard/settings', label: 'Settings' }
  ]
  async function logout(){
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/'
  }
  return (
    <aside className="w-64 bg-surface/60 p-4 rounded-lg hidden md:block">
      <div className="mb-6">
        <img src="/logo.svg" alt="XYPHORIA" className="h-8" />
      </div>
      <nav className="space-y-2">
        {items.map(i=> (
          <Link key={i.href} href={i.href} className={`block px-3 py-2 rounded ${r.pathname === i.href ? 'bg-white/6' : 'hover:bg-white/3'}`}>
            {i.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">
        <button onClick={logout} className="w-full px-3 py-2 rounded bg-white/5">Logout</button>
      </div>
    </aside>
  )
}
