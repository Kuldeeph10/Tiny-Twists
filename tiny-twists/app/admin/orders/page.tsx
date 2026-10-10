import { createClient } from '../../../lib/supabase/server'
import { Suspense } from 'react'
import OrdersListClient from './OrdersListClient'

export const dynamic = 'force-dynamic'

async function OrdersList() {
  const supabase = await createClient()

  // Fetch orders and securely join customer info and item lists
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      customers (name, phone, address),
      order_items (product_name, quantity, unit_price)
    `)
    .order('created_at', { ascending: false })

  return <OrdersListClient orders={orders || []} />
}

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg">Track customer orders, update crafting progress, and log payments.</p>
        </div>
      </div>

      <Suspense fallback={<div className="font-serif font-bold text-lg text-gray-500 p-10 text-center bg-white rounded-3xl mt-8 shadow-sm">Fetching latest orders...</div>}>
        <OrdersList />
      </Suspense>
    </div>
  )
}
