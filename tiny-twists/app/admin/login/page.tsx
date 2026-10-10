'use client'

import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-gray-900 font-bold mb-2 tracking-tight">
          Workspace
        </h1>
        <p className="text-gray-600 font-bold tracking-wide uppercase text-xs">Secure Admin Login</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-bold border border-red-100">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-5" action={login}>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800" htmlFor="email">Admin Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-pink)] focus:border-transparent transition-all"
            placeholder="owner@tinytwists.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-800" htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-pink)] focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-gray-900/20 transition-all mt-4 text-lg"
        >
          Access Dashboard
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F3] to-[#F6C445]/20 p-4 relative overflow-hidden">
      {/* Decorative Blur Blobs for modern aesthetic */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--brand-pink)] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand-green)] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <Suspense fallback={<div className="font-serif text-gray-900 font-bold">Loading secure portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
