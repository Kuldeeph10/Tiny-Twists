'use client'

import { loginCustomer } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-yellow)] border-opacity-50 w-full max-w-md">
      <h1 className="text-3xl font-serif text-[var(--foreground)] font-bold mb-2 text-center">
        Welcome Back!
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">Log in to track your beautiful orders.</p>
      
      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded-xl mb-4 text-sm text-center font-semibold border border-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4" action={loginCustomer}>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="email">Email</label>
          <input 
            id="email" name="email" type="email" required 
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="password">Password</label>
          <input 
            id="password" name="password" type="password" required 
            className="w-full px-4 py-3 bg-[var(--background)] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)]"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-[var(--brand-yellow)] text-[var(--foreground)] font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition transform mt-2"
        >
          Log In
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account yet?{' '}
        <Link href="/register" className="text-[var(--brand-pink)] font-bold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <Suspense fallback={<div className="font-serif">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
