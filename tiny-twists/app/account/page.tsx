import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export default async function AccountPage() {
  await connection() // Next.js 15 fix
  const supabase = await createClient()
  
  // Verify the user is actually logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Server action to log out
  async function logout() {
    'use server'
    const supabaseClient = await createClient()
    await supabaseClient.auth.signOut()
    redirect('/')
  }
  
  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-[var(--brand-green)]">
        <h1 className="text-3xl font-serif font-bold text-[var(--foreground)] mb-6">My Account</h1>
        <p className="text-lg">Welcome back, <strong>{user.email}</strong>!</p>
        
        <div className="mt-8 p-6 bg-[#FFF8F3] rounded-2xl">
            <h2 className="font-serif font-bold text-xl mb-2">Order History</h2>
            <p className="text-gray-500">You haven't placed any orders yet. Time to buy some cute flowers!</p>
        </div>

        <form action={logout} className="mt-12 border-t pt-6">
            <button type="submit" className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition shadow-sm">
                Log Out
            </button>
        </form>
      </div>
    </div>
  )
}
