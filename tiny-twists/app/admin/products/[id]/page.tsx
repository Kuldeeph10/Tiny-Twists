import { createClient } from '../../../../lib/supabase/server'
import { editProduct, deleteProduct, toggleProductStatus } from '../actions'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditProductImages from '../../../../components/EditProductImages'

export const dynamic = 'force-dynamic'

async function EditProductForm({ id }: { id: string }) {
  const supabase = await createClient()
  
  const { data: product } = await supabase.from('products').select('*, categories(name)').eq('id', id).single()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  if (!product) redirect('/admin/products')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      
      {/* LEFT COLUMN: Overview & Quick Actions */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative">
          
          {!product.is_active && (
             <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 uppercase tracking-widest">
               Hidden from Shop
             </div>
          )}

          <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 mb-6 relative group">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
            ) : (
              <span className="text-6xl opacity-30">🧸</span>
            )}
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-gray-900 text-center mb-2 leading-tight">{product.name}</h2>
          <span className="text-[var(--brand-pink)] text-sm font-bold bg-[#FFF8F3] px-3 py-1 rounded-lg border border-pink-100 mb-6">{product.categories?.name || 'Uncategorized'}</span>
          
          <div className="w-full flex gap-3">
            <form className="flex-1" action={toggleProductStatus}>
              <input type="hidden" name="product_id" value={product.id} />
              <input type="hidden" name="current_status" value={product.is_active.toString()} />
              <button className={`w-full py-3 font-bold rounded-xl border transition shadow-sm ${product.is_active ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'}`}>
                {product.is_active ? 'Hide Product' : 'Show Product'}
              </button>
            </form>

            <form className="flex-1" action={deleteProduct}>
               <input type="hidden" name="id" value={product.id} />
               <button type="submit" className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition shadow-sm">
                 Delete
               </button>
            </form>
          </div>
        </div>
        
        {/* STATS */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Quick Stats</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center pb-4 border-b border-gray-50">
               <span className="text-gray-500 font-bold text-sm">Selling Price</span>
               <span className="text-gray-900 font-bold text-lg">₹{product.price}</span>
             </div>
             <div className="flex justify-between items-center pb-4 border-b border-gray-50">
               <span className="text-gray-500 font-bold text-sm">Cost to Make</span>
               <span className="text-gray-900 font-bold text-lg">₹{product.cost}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">Profit Margin</span>
               <span className="text-green-600 font-bold text-xl">₹{product.price - product.cost}</span>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Edit Form */}
      <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b pb-4">Edit Product Details</h3>
        
        <form action={editProduct} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={product.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Product Name</label>
              <input name="name" type="text" defaultValue={product.name} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Category</label>
              <select name="category_id" defaultValue={product.category_id} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition appearance-none">
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
            <textarea name="description" rows={4} defaultValue={product.description} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition"></textarea>
          </div>

          <EditProductImages existingImages={product.images || []} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Selling Price (₹)</label>
              <input name="price" type="number" step="1" defaultValue={product.price} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Cost (₹)</label>
              <input name="cost" type="number" step="1" defaultValue={product.cost} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Stock</label>
              <input name="stock" type="number" defaultValue={product.stock} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
            </div>
            <div className="flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input name="made_to_order" type="checkbox" defaultChecked={product.made_to_order} className="w-6 h-6 rounded-md border-gray-300 text-[var(--brand-pink)] focus:ring-[var(--brand-pink)]" />
                <span className="text-sm font-bold text-gray-800">Made to order</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <Link href="/admin/products" className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-lg text-center">
              Cancel
            </Link>
            <button type="submit" className="px-10 py-4 bg-[var(--brand-yellow)] text-gray-900 font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition transform text-lg">
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Fix Next.js 15 params promise
  const { id } = await params;

  return (
    <div className="p-4 md:p-8 bg-[#FFF8F3] min-h-screen">
      <div className="mb-8 max-w-6xl mx-auto flex items-center gap-4">
        <Link href="/admin/products" className="text-3xl text-gray-400 hover:text-gray-900 transition">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Product Details</h1>
          <p className="text-gray-500 font-medium mt-1">View and edit your product information.</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center p-10 font-serif font-bold text-gray-500 bg-white rounded-3xl max-w-6xl mx-auto border">Loading Details...</div>}>
        <EditProductForm id={id} />
      </Suspense>
    </div>
  )
}
