'use client'

import { useCart } from '../../components/CartProvider'
import Link from 'next/link'
import { placeOrder } from './actions'
import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-sm flex items-center justify-center gap-2 ${pending ? 'bg-gray-200 text-gray-500' : 'bg-[var(--brand-pink)] text-white hover:shadow-xl hover:-translate-y-1'}`}
    >
      {pending ? 'Processing...' : 'Place Order (Cash on Delivery)'}
    </button>
  )
}

export default function CartView({ userEmail, customer, savedAddresses }: any) {
  const { items, removeFromCart, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  // State to hold the currently active text in the address box
  const [addressText, setAddressText] = useState('')
  const [activeLat, setActiveLat] = useState('')
  const [activeLng, setActiveLng] = useState('')

  useEffect(() => {
    setMounted(true)
    // If the customer has saved addresses, auto-fill the text box with their first one
    if (savedAddresses && savedAddresses.length > 0) {
      setAddressText(savedAddresses[0].address)
      setActiveLat(savedAddresses[0].lat)
      setActiveLng(savedAddresses[0].lng)
    }
  }, [savedAddresses])

  if (!mounted) return null 

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-8xl mb-6 opacity-50">🛒</span>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any cute handmade twists to your cart yet!</p>
        <Link href="/#shop" className="px-8 py-4 bg-[var(--brand-yellow)] text-gray-900 font-bold rounded-full hover:shadow-lg transition transform hover:-translate-y-1">
          Continue Shopping
        </Link>
      </div>
    )
  }

  // Bind the client-side cart state to the server action
  const placeOrderWithCart = placeOrder.bind(null, items, totalPrice)

  return (
    <div className="min-h-screen bg-[#FFF8F3] pb-24">
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto border-b border-pink-100/50 mb-8">
        <Link href="/" className="text-3xl font-serif font-bold text-[var(--brand-pink)] tracking-tight hover:scale-105 transition">
          Tiny Twists
        </Link>
        <Link href="/#shop" className="text-gray-500 font-bold hover:text-gray-900 transition bg-white px-4 py-2 rounded-full shadow-sm text-sm">
          Continue Shopping
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Cart Items */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Your Items</h2>
          <div className="flex flex-col gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 relative group hover:border-pink-200 transition">
                <div className="h-24 w-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl opacity-20">🧸</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 font-medium">Qty: <span className="text-gray-900 font-bold">{item.quantity}</span></p>
                  <p className="font-bold text-[var(--brand-pink)] text-lg">₹{item.price * item.quantity}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-red-300 hover:text-white hover:bg-red-400 rounded-xl transition"
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-500 font-serif">Total (INR)</span>
            <span className="text-4xl font-bold text-gray-900">₹{totalPrice}</span>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Delivery Details</h2>
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <form action={placeOrderWithCart} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
                <input name="name" type="text" defaultValue={customer?.name || ''} required placeholder="e.g. Priya Sharma" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
                <input name="email" type="email" defaultValue={userEmail || ''} disabled placeholder="Login to auto-fill" className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-medium outline-none cursor-not-allowed shadow-inner" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Phone Number (WhatsApp)</label>
                <input name="phone" type="tel" defaultValue={customer?.phone || ''} required placeholder="e.g. +91 98765 43210" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
              </div>
              
              {/* Intelligent Address Box */}
              <div className="p-6 bg-[#FFF8F3] border border-[var(--brand-yellow)] border-opacity-40 rounded-[2rem]">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-900">Delivery Address</label>
                  <Link href="/profile/addresses" className="text-xs font-bold text-[var(--brand-pink)] bg-white px-3 py-1.5 rounded-lg border border-pink-100 hover:shadow-sm transition">
                    📍 Manage Addresses
                  </Link>
                </div>

                {/* Dropdown to select a saved address */}
                {savedAddresses && savedAddresses.length > 0 && (
                  <div className="mb-4">
                    <select 
                      onChange={(e) => {
                        const selected = savedAddresses.find((a: any) => a.address === e.target.value)
                        setAddressText(e.target.value)
                        if (selected) {
                          setActiveLat(selected.lat)
                          setActiveLng(selected.lng)
                        } else {
                          setActiveLat('')
                          setActiveLng('')
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] transition cursor-pointer"
                    >
                      <option disabled value="">Select a saved address...</option>
                      {savedAddresses.map((addr: any) => (
                        <option key={addr.id} value={addr.address}>
                          {addr.title} - {addr.address.substring(0,30)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Hidden inputs to pass coordinates directly to the server */}
                <input type="hidden" name="lat" value={activeLat} />
                <input type="hidden" name="lng" value={activeLng} />
                
                {/* The actual text area that gets submitted */}
                <textarea 
                  name="address" 
                  required 
                  rows={3} 
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="House number, street, city, pin code..." 
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition shadow-sm"
                ></textarea>
                <p className="text-xs text-gray-500 mt-3 font-medium">You can manually edit the text in the box above for this specific order without affecting your saved addresses.</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Order Notes (Optional)</label>
                <textarea name="notes" rows={2} placeholder="Any specific colors or customization requests?" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition"></textarea>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-2">
                <SubmitButton />
                <p className="text-center text-xs text-gray-500 mt-4 font-bold bg-gray-50 py-2 rounded-lg">
                  ✅ Cash on Delivery (COD). We will confirm your order on WhatsApp!
                </p>
              </div>

            </form>
          </div>
        </div>

      </main>
    </div>
  )
}
