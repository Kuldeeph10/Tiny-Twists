import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function DashboardData() {
  const supabase = await createClient()
  
  // Check if they are logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Check if they are an admin in the database
  const { data: adminCheck } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!adminCheck) {
    return <div className="text-red-500 font-bold">Access Denied: You are not an admin.</div>
  }

  return (
    <>
      <h1 className="text-3xl font-serif font-bold mb-4 text-[var(--brand-pink)]">Dashboard Overview</h1>
      <p className="text-gray-600 text-lg">Welcome back! You are securely logged into your admin dashboard.</p>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 border rounded-xl shadow-sm bg-[var(--brand-yellow)] bg-opacity-10">
          <h3 className="font-bold text-xl mb-1">Orders Today</h3>
          <p className="text-3xl font-serif text-[var(--foreground)]">0</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm bg-[var(--brand-green)] bg-opacity-10">
          <h3 className="font-bold text-xl mb-1">Total Income</h3>
          <p className="text-3xl font-serif text-[var(--foreground)]">₹0</p>
        </div>
      </div>
    </>
  )
}

export default function AdminOverview() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardData />
      </Suspense>
    </div>
  )
}
