'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { logoutAdmin } from './login/actions'

export default function SidebarWrapper({ 
  children, 
  isAdmin 
}: { 
  children: React.ReactNode
  isAdmin: boolean 
}) {
  const pathname = usePathname()

  // Fix: Do not show the sidebar if they are not an admin OR if they are on the login page!
  if (!isAdmin || pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r flex-col hidden md:flex shadow-sm z-10 relative">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-serif font-bold text-[var(--brand-pink)] tracking-tight">Tiny Twists</h2>
          <p className="text-xs text-gray-500 mt-1 font-bold tracking-wider uppercase">Workspace</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin/overview" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/overview' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">🏠</span> Overview
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/products' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">🧸</span> Products
          </Link>
          <Link href="/admin/materials" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/materials' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">🧶</span> Materials
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/orders' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">📦</span> Orders
          </Link>
          <Link href="/admin/customers" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/customers' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">👥</span> Customers
          </Link>
          <Link href="/admin/expenses" className={`flex items-center gap-3 p-3 rounded-xl transition font-bold ${pathname === '/admin/expenses' ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="text-xl">💰</span> Expenses
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <form action={logoutAdmin}>
            <button type="submit" className="w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition font-bold flex items-center justify-center gap-2">
              <span className="text-xl">🚪</span> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Nav (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/admin/overview" className="p-3 text-2xl hover:scale-110 transition">🏠</Link>
        <Link href="/admin/products" className="p-3 text-2xl hover:scale-110 transition">🧸</Link>
        <Link href="/admin/orders" className="p-3 text-2xl hover:scale-110 transition">📦</Link>
        <Link href="/admin/expenses" className="p-3 text-2xl hover:scale-110 transition">💰</Link>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-0">
        {children}
      </main>
    </div>
  )
}
