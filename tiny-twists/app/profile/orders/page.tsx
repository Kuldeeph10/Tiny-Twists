import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function OrderHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Find this user's customer record
  const { data: customer } = await supabase.from('customers').select('id').eq('auth_id', user?.id).single()
  
  // 2. Fetch all their orders
  let orders: any[] = []
  if (customer) {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (product_name, quantity, unit_price)
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      
    orders = data || []
  }

  const statusMap: Record<string, { label: string, color: string }> = {
    new: { label: '🆕 Order Placed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    making: { label: '🎨 Currently Making', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    ready: { label: '✅ Ready to Ship', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    delivered: { label: '🚀 Delivered', color: 'bg-green-50 text-green-700 border-green-200' },
    cancelled: { label: '❌ Cancelled', color: 'bg-red-50 text-red-700 border-red-200' }
  }

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h3 className="text-3xl font-serif font-bold text-gray-900">Order History</h3>
        <span className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
          {orders.length} Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
           <span className="text-6xl mb-4 block opacity-30">📦</span>
           <h4 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h4>
           <p className="text-gray-500 mb-6">You haven't bought any tiny twists yet!</p>
           <Link href="/#shop" className="px-6 py-3 bg-[var(--brand-yellow)] text-gray-900 font-bold rounded-xl hover:shadow-md transition">
             Start Shopping
           </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                  <p className="text-gray-900 font-bold">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-gray-900 font-bold">₹{order.total} <span className="text-xs font-normal text-gray-500">({order.payment_status === 'paid' ? 'Paid' : 'COD'})</span></p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-gray-900 font-bold text-sm">#{order.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  {/* Status Banner */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusMap[order.status]?.label || order.status}
                    </div>
                    {order.status === 'making' && (
                      <p className="text-sm text-gray-500 mt-3 max-w-sm">
                        Your custom handmade items are currently being twisted! We will notify you when they are ready.
                      </p>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <h5 className="font-bold text-gray-900 mb-3 border-b pb-2 text-sm uppercase tracking-wider">Items in this order</h5>
                <ul className="flex flex-col gap-3">
                  {order.order_items?.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--brand-pink)] font-bold text-sm shadow-sm">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-gray-800">{item.product_name}</span>
                      </div>
                      <span className="font-bold text-gray-900">₹{item.unit_price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
