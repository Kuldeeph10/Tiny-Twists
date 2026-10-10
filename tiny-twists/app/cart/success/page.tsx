'use client'

import { useEffect, Suspense } from 'react'
import { useCart } from '../../../components/CartProvider'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg') || ''

  // Clear the cart as soon as they hit the success page
  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919999999999' // Fallback for dev
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${msg}`

  return (
    <div className="min-h-screen bg-[#FFF8F3] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-green-100/50 max-w-xl w-full border border-green-50">
        <span className="text-7xl mb-6 block animate-bounce">🎉</span>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Order Placed!</h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Your order has been saved successfully. To confirm it and arrange delivery, please send us the order details on WhatsApp!
        </p>
        
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white font-bold rounded-2xl hover:shadow-lg hover:-translate-y-1 transition transform text-xl mb-6"
        >
          <span>💬</span> Send WhatsApp Message
        </a>

        <Link href="/#shop" className="text-gray-500 font-bold hover:text-gray-900 transition block">
          ← Back to Shop
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center font-serif text-xl text-gray-500 font-bold">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
