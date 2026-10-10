'use client'

import { useState } from 'react'

export default function EditProductImages({ existingImages = [] }: { existingImages: string[] }) {
  const [images, setImages] = useState<string[]>(existingImages)
  
  const makePrimary = (idx: number) => {
    if (idx === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(idx, 1);
    newImages.unshift(selected);
    setImages(newImages);
  };
  
  return (
    <div className="p-6 bg-[#FFF8F3] rounded-2xl border border-[var(--brand-yellow)] border-opacity-30">
      <label className="block text-sm font-bold text-gray-800 mb-4">Manage Photos</label>
      
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <div key={idx} className={`relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-yellow-400 shadow-md' : 'border-gray-200'}`}>
              <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
              
              {/* Delete Button */}
              <button 
                type="button" 
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition z-10"
                title="Remove image"
              >
                ✕
              </button>

              {/* Make Primary / Star Button */}
              <button
                type="button"
                onClick={() => makePrimary(idx)}
                className={`absolute bottom-1 left-1 px-2 py-1 text-xs font-bold rounded-lg shadow-sm transition z-10 ${idx === 0 ? 'bg-yellow-400 text-white cursor-default' : 'bg-white text-gray-400 hover:text-yellow-500 hover:bg-gray-50'}`}
                title={idx === 0 ? "Cover Image" : "Make Cover Image"}
              >
                {idx === 0 ? '★ Cover' : '☆ Make Cover'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden input to pass remaining old images to the server */}
      <input type="hidden" name="kept_images" value={JSON.stringify(images)} />
      
      <label className="block text-sm font-bold text-gray-800 mb-2">Upload Additional Photos</label>
      <input name="images" type="file" accept="image/*" multiple className="w-full text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-gray-900 hover:file:bg-gray-50 transition cursor-pointer border border-pink-100 bg-white rounded-xl shadow-sm p-1" />
      <p className="text-xs text-gray-500 mt-3 font-medium">Any new photos you select here will be added to the product.</p>
    </div>
  )
}
