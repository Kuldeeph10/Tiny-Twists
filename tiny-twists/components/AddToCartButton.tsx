'use client'

import { useCart, CartItem } from './CartProvider'

export default function AddToCartButton({ 
  product, 
  isSmall = false 
}: { 
  product: CartItem, 
  isSmall?: boolean 
}) {
  const { addToCart } = useCart()
  
  if (isSmall) {
    return (
      <button 
        onClick={(e) => {
          e.preventDefault() // prevent the Link surrounding the card from clicking
          addToCart(product)
        }}
        className="relative z-10 h-8 w-8 md:h-10 md:w-10 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center text-lg hover:scale-110 hover:bg-[var(--brand-pink)] hover:text-white transition-all shadow-sm"
        title="Add to Cart"
      >
        +
      </button>
    )
  }

  return (
    <button 
      onClick={() => addToCart(product)}
      className="flex-1 bg-[var(--brand-pink)] text-white text-xl font-bold py-5 rounded-2xl hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-1 transition transform flex items-center justify-center gap-3"
    >
      <span className="text-2xl">🛒</span> Add to Cart
    </button>
  )
}
