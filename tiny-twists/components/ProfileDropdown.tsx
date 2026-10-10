'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { logoutUser } from '../app/auth/actions'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 md:w-11 md:h-11 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center text-xl md:text-2xl hover:scale-110 transition shadow-sm border border-yellow-200 focus:outline-none"
        title="My Account"
      >
        🧸
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-pink-100/50 border border-gray-100 overflow-hidden z-50">
          <div className="p-4 bg-[#FFF8F3] border-b border-gray-100">
            <p className="font-serif font-bold text-[var(--brand-pink)]">My Account</p>
          </div>
          <div className="flex flex-col p-2 gap-1">
            <Link href="/profile" onClick={() => setIsOpen(false)} className="px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-pink)] rounded-xl transition flex items-center gap-3">
              <span className="text-lg">⚙️</span> Settings
            </Link>
            <Link href="/profile/addresses" onClick={() => setIsOpen(false)} className="px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-pink)] rounded-xl transition flex items-center gap-3">
              <span className="text-lg">📍</span> Addresses
            </Link>
            <Link href="/profile/orders" onClick={() => setIsOpen(false)} className="px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-pink)] rounded-xl transition flex items-center gap-3">
              <span className="text-lg">📦</span> Order History
            </Link>
            <div className="h-px bg-gray-100 my-1 mx-2"></div>
            <form action={logoutUser}>
              <button type="submit" className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition flex items-center gap-3">
                <span className="text-lg">🚪</span> Log Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
