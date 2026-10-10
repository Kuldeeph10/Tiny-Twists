'use client'

import { useState } from 'react'
import { saveNewAddress } from '../app/profile/actions'

export default function AddressForm() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [loadingLoc, setLoadingLoc] = useState(false)
  
  const getLocation = () => {
    setLoadingLoc(true)
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      setLoadingLoc(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString())
        setLng(position.coords.longitude.toString())
        setLoadingLoc(false)
      },
      (error) => {
        alert("Could not get live location. Please ensure location services are enabled.")
        setLoadingLoc(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <form action={saveNewAddress} className="flex flex-col gap-6 max-w-xl mt-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm">
       <h4 className="font-serif font-bold text-gray-900 text-xl border-b pb-3 mb-2">Add New Address</h4>
       
       <div>
         <label className="block text-sm font-bold text-gray-800 mb-2">Label (e.g., Home, Office)</label>
         <input name="title" type="text" required placeholder="Home" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition shadow-sm" />
       </div>
       
       <div>
         <label className="block text-sm font-bold text-gray-800 mb-2">Full Address</label>
         <textarea name="address" required rows={3} placeholder="House number, Street, City, Pincode..." className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition shadow-sm"></textarea>
       </div>

       <div className="bg-[#FFF8F3] p-5 rounded-2xl border border-[var(--brand-yellow)] border-opacity-30">
         <label className="block text-sm font-bold text-gray-800 mb-3">Delivery Coordinates</label>
         <div className="flex gap-4 mb-4">
           <input type="text" name="lat" value={lat} readOnly required placeholder="Latitude" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-gray-900 text-sm font-bold outline-none cursor-not-allowed text-center shadow-sm" />
           <input type="text" name="lng" value={lng} readOnly required placeholder="Longitude" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-gray-900 text-sm font-bold outline-none cursor-not-allowed text-center shadow-sm" />
         </div>
         <button type="button" onClick={getLocation} disabled={loadingLoc} className="w-full py-4 bg-[var(--brand-yellow)] text-gray-900 font-bold rounded-xl hover:shadow-md transition transform active:scale-95 text-sm flex items-center justify-center gap-2">
            <span className="text-xl">📍</span> {loadingLoc ? 'Fetching GPS...' : 'Tap to Auto-Fill Current Location'}
         </button>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mt-3">We use this to deliver exactly to your door!</p>
       </div>

       <button type="submit" className="mt-2 px-8 py-4 bg-[var(--brand-pink)] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition transform text-lg w-full">
          Save Address
       </button>
    </form>
  )
}
