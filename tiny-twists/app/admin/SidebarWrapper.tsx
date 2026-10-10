'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { logoutAdmin } from './login/actions'
import { useState } from 'react'

export default function SidebarWrapper({ 
  children, 
  isAdmin 
}: { 
  children: React.ReactNode
  isAdmin: boolean 
}) {
  const pathname = usePathname()
  
  // State for collapsible and pinned sidebar
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPinned, setIsPinned] = useState(true)

  if (!isAdmin || pathname === '/admin/login') {
    return <>{children}</>
  }

  // Organized Categories for the Sidebar
  const navGroups = [
    {
      title: 'Dashboard',
      links: [
        { href: '/admin/overview', icon: '🏠', label: 'Overview' },
      ]
    },
    {
      title: 'Shop Management',
      links: [
        { href: '/admin/products', icon: '🧸', label: 'Products' },
        { href: '/admin/orders', icon: '📦', label: 'Orders' },
        { href: '/admin/customers', icon: '👥', label: 'Customers' },
      ]
    },
    {
      title: 'Inventory & Finance',
      links: [
        { href: '/admin/materials', icon: '🧶', label: 'Materials' },
        { href: '/admin/expenses', icon: '💰', label: 'Expenses' },
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-[#FFF8F3] overflow-hidden">
      
      {/* Desktop Sidebar (Collapsible & Pinnable) */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out relative z-20 ${isExpanded ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => !isPinned && setIsExpanded(true)}
        onMouseLeave={() => !isPinned && setIsExpanded(false)}
      >
        {/* Header & Pin Button */}
        <div className="h-20 flex items-center justify-between p-4 border-b border-gray-50 relative">
          
          {/* Expanded Logo */}
          <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[var(--brand-pink)] tracking-tight leading-none">Tiny Twists</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Admin Panel</p>
            </div>
          </div>
          
          {/* Collapsed Logo (Only visible when small) */}
          <div className={`absolute left-0 w-20 flex justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className="text-3xl font-serif font-bold text-[var(--brand-pink)]">T</span>
          </div>

          {/* Pin Button */}
          <button 
            onClick={() => {
              setIsPinned(!isPinned)
              setIsExpanded(!isPinned) // Expand if pinning, collapse if unpinning
            }}
            className={`hidden md:flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition z-10 ${!isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {isPinned ? '📌' : '📍'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              
              {/* Category Header */}
              <div className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                {group.title}
              </div>
              
              {/* Links */}
              <div className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const isActive = pathname.startsWith(link.href)
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-[var(--brand-yellow)] bg-opacity-20 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                      title={!isExpanded ? link.label : ''}
                    >
                      <span className={`text-xl flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {link.icon}
                      </span>
                      
                      <span className={`ml-4 font-bold text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {link.label}
                      </span>
                      
                      {/* Active indicator dot when collapsed */}
                      {!isExpanded && isActive && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--brand-yellow)]"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Footer / Logout */}
        <div className="p-3 border-t border-gray-50">
          <form action={logoutAdmin}>
            <button 
              type="submit" 
              className="w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition group relative overflow-hidden"
              title={!isExpanded ? 'Log Out' : ''}
            >
              <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">🚪</span>
              <span className={`ml-4 font-bold text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                Log Out
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Nav (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
        <Link href="/admin/overview" className={`p-3 text-2xl transition-transform ${pathname === '/admin/overview' ? 'scale-125 bg-gray-50 rounded-full' : 'hover:scale-110'}`}>🏠</Link>
        <Link href="/admin/products" className={`p-3 text-2xl transition-transform ${pathname.startsWith('/admin/products') ? 'scale-125 bg-gray-50 rounded-full' : 'hover:scale-110'}`}>🧸</Link>
        <Link href="/admin/orders" className={`p-3 text-2xl transition-transform ${pathname.startsWith('/admin/orders') ? 'scale-125 bg-gray-50 rounded-full' : 'hover:scale-110'}`}>📦</Link>
        <Link href="/admin/expenses" className={`p-3 text-2xl transition-transform ${pathname.startsWith('/admin/expenses') ? 'scale-125 bg-gray-50 rounded-full' : 'hover:scale-110'}`}>💰</Link>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-10 w-full custom-scrollbar">
        {children}
      </main>
    </div>
  )
}
