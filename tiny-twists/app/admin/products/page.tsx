import { createClient } from '../../../lib/supabase/server'
import { toggleProductStatus } from './actions'
import { Suspense } from 'react'
import Link from 'next/link'

export const instant = false

async function ProductsList() {
  const supabase = await createClient()
  
  // Fetch products
  const { data: products } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header (Hidden on Mobile) */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:grid">
        <div className="col-span-1 text-center">Image</div>
        <div className="col-span-4">Product Details</div>
        <div className="col-span-2">Pricing</div>
        <div className="col-span-2">Inventory</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {products?.map(product => (
        <div key={product.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5 border-b border-gray-100 last:border-0 items-center transition ${!product.is_active ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50/50'}`}>
          
          {/* Image */}
          <div className="col-span-1 h-20 w-20 md:h-14 md:w-14 mx-auto bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl opacity-40">🧸</span>
            )}
          </div>

          {/* Details */}
          <div className="col-span-4 text-center md:text-left">
            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
            <span className="inline-block px-2 py-1 bg-[#FFF8F3] text-[var(--brand-pink)] text-xs font-bold rounded-md mt-1 border border-pink-100">
              {product.categories?.name || 'Uncategorized'}
            </span>
          </div>
          
          {/* Price / Cost */}
          <div className="col-span-2 text-center md:text-left">
            <div className="font-bold text-gray-900 text-lg">₹{product.price}</div>
            <div className="text-xs text-green-600 font-bold">Profit: ₹{product.price - product.cost}</div>
          </div>

          {/* Inventory */}
          <div className="col-span-2 text-center md:text-left">
            {product.made_to_order ? (
              <span className="inline-flex items-center justify-center md:justify-start gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md w-full md:w-auto">
                🎨 Made to Order
              </span>
            ) : (
              <span className={`inline-flex items-center justify-center md:justify-start gap-1 text-sm font-bold px-2 py-1 rounded-md w-full md:w-auto ${product.stock > 0 ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'}`}>
                📦 {product.stock} in stock
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="col-span-3 flex flex-row gap-2 justify-end">
            <Link href={`/admin/products/${product.id}`} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm shadow-sm flex-1 text-center flex items-center justify-center">
              View/Edit
            </Link>
            
            <form action={toggleProductStatus} className="flex-1">
              <input type="hidden" name="product_id" value={product.id} />
              <input type="hidden" name="current_status" value={product.is_active.toString()} />
              <button type="submit" className={`w-full h-full px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm border ${product.is_active ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'}`}>
                {product.is_active ? 'Hide' : 'Show'}
              </button>
            </form>
          </div>
        </div>
      ))}

      {products?.length === 0 && (
        <div className="p-16 text-center">
          <div className="text-6xl mb-4">🌻</div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Your inventory is empty. Click the button above to add your first beautiful creation!</p>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="p-4 md:p-8 bg-[#FFF8F3] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your shop's inventory and listings.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[var(--brand-pink)] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition transform flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
        >
          <span className="text-2xl leading-none -mt-1">+</span> Add New Product
        </Link>
      </div>

      <Suspense fallback={<div className="font-serif font-bold text-lg text-gray-500 p-8 text-center bg-white rounded-3xl border">Loading inventory...</div>}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
