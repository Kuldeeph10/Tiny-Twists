import { createClient } from '../../../../lib/supabase/server'
import { addProduct } from '../actions'
import Link from 'next/link'
import { Suspense } from 'react'

export const instant = false

async function AddProductForm() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 w-full max-w-4xl mx-auto">
      <form action={addProduct} className="flex flex-col gap-8">
        
        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Product Name</label>
            <input name="name" type="text" required placeholder="e.g. Pink Tulip Bouquet" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Category</label>
            <select name="category_id" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition appearance-none">
              <option value="">Select a category...</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
          <textarea name="description" rows={4} placeholder="Describe the lovely details, materials used, size..." className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition"></textarea>
        </div>

        {/* Image Upload */}
        <div className="p-6 bg-[#FFF8F3] rounded-2xl border border-[var(--brand-yellow)] border-opacity-30">
          <label className="block text-sm font-bold text-gray-800 mb-2">Product Photo</label>
          <input name="image" type="file" accept="image/*" className="w-full text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[var(--brand-yellow)] file:text-gray-900 hover:file:bg-opacity-80 transition cursor-pointer" />
          <p className="text-xs text-gray-500 mt-2 font-medium">Square images (1:1 ratio) look the best on the storefront!</p>
        </div>

        {/* Financials & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Selling Price (₹)</label>
            <input name="price" type="number" step="1" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Cost to Make (₹)</label>
            <input name="cost" type="number" step="1" defaultValue="0" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Items in Stock</label>
            <input name="stock" type="number" defaultValue="0" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input name="made_to_order" type="checkbox" className="w-6 h-6 rounded-md border-gray-300 text-[var(--brand-pink)] focus:ring-[var(--brand-pink)]" />
              <span className="text-sm font-bold text-gray-800">Made to order?</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4 pt-8 border-t border-gray-100">
          <Link href="/admin/products" className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-lg text-center">
            Cancel
          </Link>
          <button type="submit" className="px-10 py-4 bg-[var(--brand-pink)] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition transform text-lg">
            Create Product
          </button>
        </div>

      </form>
    </div>
  )
}

export default function NewProductPage() {
  return (
    <div className="p-4 md:p-8 bg-[#FFF8F3] min-h-screen">
      <div className="mb-8 max-w-4xl mx-auto flex items-center gap-4">
        <Link href="/admin/products" className="text-3xl text-gray-400 hover:text-gray-900 transition">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-gray-500 font-medium mt-1">Upload a beautiful photo and fill out the details.</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center p-10 font-serif font-bold text-gray-500 bg-white rounded-3xl max-w-4xl mx-auto border">Loading Form...</div>}>
        <AddProductForm />
      </Suspense>
    </div>
  )
}
