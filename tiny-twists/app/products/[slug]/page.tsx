import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import AddToCartButton from '../../../components/AddToCartButton'
import ProfileDropdown from '../../../components/ProfileDropdown'
import CartIcon from '../../../components/CartIcon'
import ImageSlider from '../../../components/ImageSlider'

export const dynamic = 'force-dynamic'

async function ProductDetails({ slug }: { slug: string }) {
  const supabase = await createClient()
  
  // Fetch active product by its URL-friendly slug
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
    
  if (!product) {
    redirect('/')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-pink-50">
      
      {/* Product Image Slider */}
      <div className="w-full aspect-square bg-[#FFF8F3] rounded-[2rem] overflow-hidden flex items-center justify-center relative border border-gray-100 shadow-inner group">
        <ImageSlider images={product.images || []} fallbackUrl={product.image_url} />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center">
        <Link href="/#shop" className="text-sm font-bold text-gray-400 hover:text-[var(--brand-pink)] transition mb-6">← Back to Shop</Link>
        
        <span className="text-[var(--brand-pink)] text-sm font-bold tracking-widest uppercase mb-2">
          {product.categories?.name || 'Cute Craft'}
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] mb-4">
          {product.name}
        </h1>
        
        <p className="text-3xl font-bold text-gray-900 mb-6 bg-[var(--brand-yellow)] bg-opacity-20 inline-block px-4 py-2 rounded-xl w-fit">
          ₹{product.price}
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {product.description || "A beautifully handmade twisted creation, made entirely from fluffy pipe cleaners. Perfect as a gift or a tiny companion."}
        </p>
        
        <div className="mb-10">
          {product.made_to_order ? (
            <div className="flex items-center gap-2 text-purple-700 bg-purple-50 px-4 py-2 rounded-xl w-fit font-bold border border-purple-100">
              🎨 Made to order (Please allow extra time)
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl w-fit font-bold border ${product.stock > 0 ? 'text-blue-700 bg-blue-50 border-blue-100' : 'text-red-700 bg-red-50 border-red-100'}`}>
              {product.stock > 0 ? `📦 ${product.stock} items in stock (Ready to ship)` : '❌ Currently out of stock'}
            </div>
          )}
        </div>

        {/* Add to Cart Actions */}
        <div className="flex gap-4">
          <AddToCartButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image_url: product.image_url
            }} 
          />
        </div>
      </div>
    </div>
  )
}

export default async function PublicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Fix for Next.js 15 params promise
  const { slug } = await params
  
  return (
    <div className="min-h-screen bg-[#FFF8F3] selection:bg-[var(--brand-pink)] selection:text-white">
      {/* Mini Header for easy navigation */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto border-b border-pink-100/50 mb-8">
        <Link href="/" className="text-3xl font-serif font-bold text-[var(--brand-pink)] tracking-tight hover:scale-105 transition">
          Tiny Twists
        </Link>
        <div className="flex items-center gap-4">
          <CartIcon />
          <ProfileDropdown />
        </div>
      </header>

      <main className="px-4 md:px-8 pb-20">
        <Suspense fallback={<div className="text-center font-serif font-bold text-gray-500 py-32 text-xl">Loading magic...</div>}>
           <ProductDetails slug={slug} />
        </Suspense>
      </main>
    </div>
  )
}
