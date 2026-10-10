import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileNav from '../../components/ProfileNav'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] pb-24">
      <header className="p-6 border-b border-pink-100 max-w-7xl mx-auto flex justify-between items-center bg-[#FFF8F3]">
        <Link href="/" className="text-3xl font-serif font-bold text-[var(--brand-pink)] tracking-tight hover:scale-105 transition">Tiny Twists</Link>
        <Link href="/" className="text-gray-500 font-bold hover:text-[var(--brand-pink)] transition bg-white px-4 py-2 rounded-full shadow-sm text-sm">← Back to Shop</Link>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 shrink-0">
           <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 pl-4">My Account</h2>
           <ProfileNav />
        </aside>
        
        <main className="flex-1 bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
           {children}
        </main>
      </div>
    </div>
  )
}
