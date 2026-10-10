'use client'

import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[var(--brand-yellow)] border-opacity-30">
      <h1 className="text-3xl font-serif text-[var(--foreground)] font-bold mb-2 text-center">
        Owner Login
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">Welcome back to Tiny Twists dashboard!</p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" action={login}>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)]"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-[var(--brand-pink)] text-white font-bold py-3 rounded-lg hover:opacity-90 transition mt-4"
        >
          Log In
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-yellow)] bg-opacity-10 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
