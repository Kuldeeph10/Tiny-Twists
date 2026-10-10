import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  await connection()
  const supabase = await createClient()
  
  // Check if a customer is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Server action to log out from the home page
  async function logout() {
    'use server'
    const supabaseClient = await createClient()
    await supabaseClient.auth.signOut()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--brand-pink)] selection:text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[var(--brand-pink)] tracking-tight">
          Tiny Twists
        </h1>
        <nav className="flex gap-4 md:gap-6 font-semibold items-center">
          <Link href="/products" className="hover:text-[var(--brand-pink)] transition">Shop</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-2xl hover:scale-110 transition" title="Your Cart">🛒</Link>
              <form action={logout}>
                <button type="submit" className="px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition shadow-sm text-gray-700 text-sm border">
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="px-5 py-2.5 bg-[var(--brand-yellow)] rounded-full hover:bg-opacity-80 transition shadow-sm text-[var(--foreground)]">
              Log In
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="inline-block bg-[var(--brand-green)] bg-opacity-20 text-green-800 font-bold px-4 py-1.5 rounded-full text-sm mb-6">
          ✨ 100% Handmade with Love
        </div>
        
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-[var(--foreground)] leading-[1.1] mb-6">
          Handmade <span className="text-[var(--brand-pink)]">Pipe Cleaner</span> Magic
        </h2>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[var(--foreground)] opacity-80 leading-relaxed">
          Cute, everlasting flowers, custom keychains, and tiny animals made from fluffy pipe cleaners. The perfect unique gift that never wilts!
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/products" className="px-8 py-4 bg-[var(--brand-pink)] text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition transform text-lg flex items-center gap-2">
            Explore Shop 🧸
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-yellow)] hover:shadow-md hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="text-xl font-serif font-bold mb-3 text-[var(--foreground)]">Everlasting Bouquets</h3>
            <p className="text-gray-600 leading-relaxed">Beautiful flowers that never die! We can create custom colors and arrangements just for you.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-green)] hover:shadow-md hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">🔑</div>
            <h3 className="text-xl font-serif font-bold mb-3 text-[var(--foreground)]">Custom Keychains</h3>
            <p className="text-gray-600 leading-relaxed">Personalized initials, little animals, and cute charms to carry with you everywhere you go.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-pink)] hover:shadow-md hover:-translate-y-1 transition duration-300">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-serif font-bold mb-3 text-[var(--foreground)]">Made to Order</h3>
            <p className="text-gray-600 leading-relaxed">Have a special request? Send us a message and we can twist almost anything you imagine.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
