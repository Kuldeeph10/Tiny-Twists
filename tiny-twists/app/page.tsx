import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import CartIcon from '../components/CartIcon'
import AddToCartButton from '../components/AddToCartButton'
import ProfileDropdown from '../components/ProfileDropdown'
import ImageSlider from '../components/ImageSlider'

export const dynamic = 'force-dynamic'

export default async function Home() {
  await connection()
  const supabase = await createClient()
  
  // Check if a customer is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch ACTIVE products from your database!
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FFF8F3] selection:bg-[var(--brand-pink)] selection:text-white pb-24">
      
      {/* --- HEADER --- */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[var(--brand-pink)] tracking-tight hover:scale-105 transition cursor-pointer">
          Tiny Twists
        </h1>
        <nav className="flex gap-4 md:gap-6 font-semibold items-center">
          <Link href="#shop" className="hover:text-[var(--brand-pink)] transition text-gray-800">Shop</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <CartIcon />
              <ProfileDropdown />
            </div>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-[var(--brand-yellow)] rounded-full hover:bg-opacity-80 transition shadow-sm text-gray-900 font-bold">
              Log In
            </Link>
          )}
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center relative overflow-hidden">
        
        {/* Cute background decoration blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--brand-yellow)] rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[var(--brand-pink)] rounded-full opacity-20 blur-2xl"></div>
        
        <div className="inline-block bg-white text-[var(--brand-pink)] font-bold px-5 py-2 rounded-full text-sm mb-6 shadow-sm border border-pink-100">
          ✨ 100% Handmade with Love
        </div>
        
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-6 relative z-10">
          Handmade <span className="text-[var(--brand-pink)]">Pipe Cleaner</span> Magic
        </h2>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-600 leading-relaxed relative z-10">
          Cute, everlasting flowers, custom keychains, and tiny animals. The perfect unique gift that never wilts!
        </p>
      </main>

      {/* --- DYNAMIC SHOP SECTION --- */}
      <section id="shop" className="max-w-7xl mx-auto px-6 pt-10">
        
        <div className="flex flex-col items-center mb-12">
           <h3 className="text-3xl font-serif font-bold text-gray-900">Freshly Twisted</h3>
           <div className="w-24 h-1 bg-[var(--brand-yellow)] rounded-full mt-4"></div>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">
                
                {/* Invisible link overlay covering the card */}
                <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0"></Link>

                {/* Image Box */}
                <div className="w-full aspect-square bg-[#FFF8F3] rounded-[1.5rem] overflow-hidden mb-3 relative flex items-center justify-center group/sliderwrap">
                  <ImageSlider images={product.images || []} fallbackUrl={product.image_url} />
                  
                  {/* Category Pill Over Image */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[var(--brand-pink)] text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-sm">
                    {product.categories?.name || 'Cute Craft'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-1">
                  <h4 className="text-sm md:text-base font-serif font-bold text-gray-900 mb-1 leading-tight line-clamp-2">
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50/50">
                    <div className="text-base md:text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </div>
                    
                    {/* Placeholder for future Add to Cart logic. High z-index to be clickable above Link */}
                    <AddToCartButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image_url: product.image_url
                      }}
                      isSmall={true} 
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <span className="text-6xl mb-4 block">🌸</span>
             <h4 className="text-xl font-serif font-bold text-gray-900 mb-2">Shop is currently restocking!</h4>
             <p className="text-gray-500">The admin hasn't listed any active products yet.</p>
           </div>
        )}
      </section>

      {/* --- FOOTER BANNER --- */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="bg-[var(--brand-green)] bg-opacity-20 rounded-3xl p-8 md:p-12 text-center border border-green-100 flex flex-col items-center justify-center">
          <span className="text-4xl mb-4">🎁</span>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Custom Orders Available</h3>
          <p className="text-green-800 font-medium max-w-md">Can't find exactly what you're looking for? Message us to create a 100% custom twisted design.</p>
        </div>
      </div>
      
    </div>
  )
}
