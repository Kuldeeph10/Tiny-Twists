'use client'

import { registerCustomer } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-pink)] border-opacity-30 w-full max-w-md">
      <h1 className="text-3xl font-serif text-[var(--foreground)] font-bold mb-2 text-center">
        Create an Account
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">Join Tiny Twists for faster checkout!</p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" action={registerCustomer}>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="name">Full Name</label>
          <input 
            id="name" name="name" type="text" required 
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="phone">WhatsApp / Phone</label>
          <input 
            id="phone" name="phone" type="tel" required 
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="9876543210"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="email">Email</label>
          <input 
            id="email" name="email" type="email" required 
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="password">Password</label>
          <input 
            id="password" name="password" type="password" required minLength={6}
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-[var(--brand-pink)] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition transform mt-2"
        >
          Create Account
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--brand-pink)] font-bold hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Suspense fallback={<div className="font-serif">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
