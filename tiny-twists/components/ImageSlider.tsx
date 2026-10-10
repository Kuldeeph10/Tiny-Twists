'use client'

import { useState } from 'react'

export default function ImageSlider({ images, fallbackUrl }: { images: string[], fallbackUrl: string | null }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const validImages = Array.isArray(images) && images.length > 0 ? images : (fallbackUrl ? [fallbackUrl] : [])

  if (validImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <span className="text-4xl opacity-20">🧸</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full group/slider overflow-hidden">
      <img 
        src={validImages[currentIndex]} 
        alt="Product View" 
        className="w-full h-full object-contain bg-white transition-transform duration-700 ease-in-out group-hover:scale-105"
      />
      
      {validImages.length > 1 && (
        <>
          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {validImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex ? 'bg-[var(--brand-pink)] w-3' : 'bg-white/80'}`}
              ></div>
            ))}
          </div>

          {/* Controls */}
          <button 
            onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation();
              setCurrentIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1)
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-gray-900 flex items-center justify-center text-xs shadow-md opacity-0 group-hover/slider:opacity-100 transition z-20 hover:bg-white scale-90 md:scale-100"
          >
            ←
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation();
              setCurrentIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1)
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 text-gray-900 flex items-center justify-center text-xs shadow-md opacity-0 group-hover/slider:opacity-100 transition z-20 hover:bg-white scale-90 md:scale-100"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}
