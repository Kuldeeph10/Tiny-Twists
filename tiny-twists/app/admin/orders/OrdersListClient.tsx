'use client'

import { useState } from 'react'
import { updateOrderStatus, updatePaymentStatus } from './actions'

export default function OrdersListClient({ orders }: { orders: any[] }) {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Store which orders are expanded. By default, index 0 is true.
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(() => {
    if (orders.length > 0) {
      return { [orders[0].id]: true }
    }
    return {}
  })

  const toggleOrder = (id: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200 mt-8 shadow-sm">
        <span className="text-6xl mb-4 block">📦</span>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-500">When customers place an order, it will appear right here!</p>
      </div>
    )
  }

  // Styling helpers for different statuses
  const statusColors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    making: 'bg-purple-50 text-purple-700 border-purple-200',
    ready: 'bg-orange-50 text-orange-700 border-orange-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  }

  const filteredOrders = orders.filter(o => {
    // 1. Status Filter
    const matchesFilter = filter === 'all' || o.status === filter
    if (!matchesFilter) return false
    
    // 2. Search Filter
    if (searchQuery.trim() === '') return true
    
    const query = searchQuery.toLowerCase()
    const matchesCustomer = o.customers?.name?.toLowerCase().includes(query)
    const matchesItems = o.order_items?.some((item: any) => item.product_name?.toLowerCase().includes(query))
    
    return matchesCustomer || matchesItems
  })

  return (
    <div className="flex flex-col gap-4 mt-8">
      
      {/* Search and Filter UI */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center mb-2">
        
        {/* Search Bar */}
        <div className="relative w-full xl:w-96">
          <span className="absolute left-4 top-3 text-lg opacity-50">🔍</span>
          <input 
            type="text"
            placeholder="Search customer or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-gray-900 text-sm font-bold focus:ring-2 focus:ring-[var(--brand-pink)] outline-none shadow-sm transition"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'making', 'ready', 'delivered', 'cancelled'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === f ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-3xl border border-gray-100">
           <p className="text-gray-500 font-bold">No orders found for this status.</p>
        </div>
      ) : (
        filteredOrders.map((order: any) => {
          const isExpanded = expandedOrders[order.id]
        
        // Check if there's GPS location attached to the order natively
        const hasGps = !!order.delivery_lat && !!order.delivery_lng
        const lat = order.delivery_lat
        const lng = order.delivery_lng
        
        // Clean notes
        const cleanNotes = order.notes?.trim()
        
        // Delivery address
        const deliveryAddress = order.delivery_address || order.customers?.address

        return (
          <div key={order.id} className={`bg-white rounded-[2rem] shadow-sm border ${statusColors[order.status].replace('bg-', 'border-').split(' ')[2] || 'border-gray-100'} transition-all duration-300 overflow-hidden`}>
            
            {/* Collapsed Header (Always visible) */}
            <div 
              onClick={() => toggleOrder(order.id)}
              className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-6">
                <div className={`w-3 h-3 rounded-full ${statusColors[order.status].split(' ')[1].replace('text-', 'bg-')} shadow-sm`}></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{order.customers?.name} <span className="text-sm font-normal text-gray-500 mx-2">•</span> <span className="text-[var(--brand-pink)]">₹{order.total}</span></h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                    Order #{order.id.slice(0, 6)} • {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`hidden md:inline-block px-3 py-1 rounded-xl text-xs font-bold border ${statusColors[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
                <span className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-6 pt-0 border-t border-gray-100 flex flex-col lg:flex-row gap-8 animate-in slide-in-from-top-4 fade-in duration-200 mt-6">
                
                {/* Left: Customer & Items */}
                <div className="flex-1">
                  
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <a 
                        href={`https://wa.me/${order.customers?.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#25D366]/10 text-[#25D366] text-sm font-bold rounded-xl hover:bg-[#25D366]/20 transition flex items-center gap-2"
                      >
                        📱 Chat on WhatsApp ({order.customers?.phone})
                      </a>
                    </div>
                  </div>

                  <div className="bg-[#FFF8F3] p-5 rounded-2xl mb-6 border border-[var(--brand-yellow)] border-opacity-30">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">
                      <span className="font-bold block mb-1 text-gray-900">Delivery Address:</span>
                      {deliveryAddress}
                    </p>
                    
                    {hasGps && (
                      <div className="mt-5 pt-5 border-t border-[var(--brand-yellow)] border-opacity-50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Live Delivery Coordinates</p>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <code className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 flex-1 select-all shadow-inner">
                            {lat}, {lng}
                          </code>
                          <button 
                            onClick={(e) => {
                              navigator.clipboard.writeText(`${lat}, ${lng}`)
                              const btn = e.currentTarget
                              const originalText = btn.innerHTML
                              btn.innerHTML = '✅ Copied!'
                              setTimeout(() => { btn.innerHTML = originalText }, 2000)
                            }}
                            className="px-4 py-2 bg-white text-gray-900 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 hover:shadow-sm transition"
                          >
                            📋 Copy
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-200 transition flex items-center gap-2"
                          >
                            🗺️ Open in Maps
                          </a>
                          <a 
                            href={`https://wa.me/?text=Here is the delivery location: https://www.google.com/maps/search/?api=1%26query=${lat},${lng}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#25D366]/20 text-green-800 text-sm font-bold rounded-xl hover:bg-[#25D366]/30 transition flex items-center gap-2"
                          >
                            🔗 Share to Driver
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {cleanNotes && (
                      <p className="text-sm text-orange-800 font-medium mt-4 pt-4 border-t border-orange-200/50">
                        <span className="font-bold text-orange-900">Customer Notes:</span> {cleanNotes}
                      </p>
                    )}
                  </div>

                  {/* Cart Items Summary */}
                  <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Ordered Items</h4>
                  <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <span className="text-gray-800 font-medium">
                          <span className="font-bold text-[var(--brand-pink)] mr-2">{item.quantity}x</span> 
                          {item.product_name}
                        </span>
                        <span className="font-bold text-gray-900">₹{item.unit_price * item.quantity}</span>
                      </div>
                    ))}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total</span>
                      <span className="text-3xl font-bold text-gray-900">₹{order.total}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Management Controls */}
                <div className="lg:w-80 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                  
                  {/* Fulfillment Status Update */}
                  <div className={`p-5 rounded-2xl border shadow-sm ${statusColors[order.status]}`}>
                    <h4 className="text-xs font-bold mb-3 uppercase tracking-wider opacity-80">Fulfillment Status</h4>
                    <form action={updateOrderStatus} className="flex flex-col gap-3">
                      <input type="hidden" name="order_id" value={order.id} />
                      <select 
                        name="status" 
                        defaultValue={order.status}
                        className="w-full px-4 py-3 rounded-xl text-sm font-bold border-none outline-none appearance-none cursor-pointer shadow-sm text-gray-900 bg-white"
                      >
                        <option value="new">🆕 New Order</option>
                        <option value="making">🎨 Currently Making</option>
                        <option value="ready">✅ Ready to Ship/Deliver</option>
                        <option value="delivered">🚀 Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <button type="submit" className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 text-sm font-bold shadow-sm transition">
                        Update Status
                      </button>
                    </form>
                  </div>

                  {/* Payment Status Update */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Payment</h4>
                    <form action={updatePaymentStatus} className="flex flex-col gap-3">
                      <input type="hidden" name="order_id" value={order.id} />
                      <select 
                        name="payment_status" 
                        defaultValue={order.payment_status}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none appearance-none cursor-pointer shadow-sm ${order.payment_status === 'paid' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}
                      >
                        <option value="unpaid">❌ Unpaid (COD)</option>
                        <option value="paid">✅ Paid</option>
                      </select>
                      <button type="submit" className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 text-sm font-bold shadow-sm transition">
                        Update Payment
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}
          </div>
        )
      }))}
    </div>
  )
}
