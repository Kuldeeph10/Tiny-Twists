'use client'

import { useCart } from './CartProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CartIcon() {
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors by only rendering the badge after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Link href="/cart" className="relative text-2xl hover:scale-110 transition bg-white p-2 rounded-full shadow-sm" title="Your Cart">
      🛒
      {mounted && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
