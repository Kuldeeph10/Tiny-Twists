import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { connection } from 'next/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection() // Fix Next.js 15 dynamic rendering rule
  const supabase = await createClient()
  
  // We check if you are logged in.
  const { data: { user } } = await supabase.auth.getUser()

  // If you are NOT logged in, just show the page normally (this allows the Login page to be full screen)
  if (!user) {
    return <>{children}</>
  }

  // If you ARE logged in, wrap the page in the Dashboard Shell with the Sidebar
  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r flex-col hidden md:flex shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-serif font-bold text-[var(--brand-pink)]">Tiny Twists</h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin/overview" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>🏠</span> Overview
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>🧸</span> Products
          </Link>
          <Link href="/admin/materials" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>🧶</span> Materials
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>📦</span> Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>👥</span> Customers
          </Link>
          <Link href="/admin/expenses" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--brand-yellow)] hover:bg-opacity-20 transition text-[var(--foreground)] font-semibold">
            <span>💰</span> Expenses
          </Link>
        </nav>
      </aside>

      {/* Mobile Nav (Bottom Bar) - Shows only on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
        <Link href="/admin/overview" className="p-3 text-2xl">🏠</Link>
        <Link href="/admin/products" className="p-3 text-2xl">🧸</Link>
        <Link href="/admin/orders" className="p-3 text-2xl">📦</Link>
        <Link href="/admin/expenses" className="p-3 text-2xl">💰</Link>
      </nav>

      {/* Main Content Area where the actual pages load */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
