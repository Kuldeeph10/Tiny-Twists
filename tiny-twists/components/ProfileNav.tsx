'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProfileNav() {
  const pathname = usePathname()
  
  const navs = [
    { href: '/profile', label: '⚙️ Settings' },
    { href: '/profile/addresses', label: '📍 Saved Addresses' },
    { href: '/profile/orders', label: '📦 Order History' },
  ]

  return (
    <nav className="flex flex-col gap-2">
      {navs.map(nav => {
        const isActive = pathname === nav.href
        return (
          <Link 
            key={nav.href}
            href={nav.href} 
            className={`p-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-white text-[var(--brand-pink)] shadow-sm' : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}`}
          >
            {nav.label}
          </Link>
        )
      })}
    </nav>
  )
}
