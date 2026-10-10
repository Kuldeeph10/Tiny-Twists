import { createClient } from '../../../lib/supabase/server'
import { deleteSavedAddress } from '../actions'
import AddressForm from '../../../components/AddressForm'

export const dynamic = 'force-dynamic'

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: customer } = await supabase.from('customers').select('saved_addresses').eq('auth_id', user?.id).single()
  const addresses = customer?.saved_addresses || []

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h3 className="text-3xl font-serif font-bold text-gray-900">Saved Addresses</h3>
        <span className="text-sm font-bold text-[var(--brand-pink)] bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
          {addresses.length}/3 Saved
        </span>
      </div>

      {addresses.length === 0 ? (
         <p className="text-gray-500 mb-8 font-medium">You haven't saved any addresses yet. Add one below for faster checkout!</p>
      ) : (
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="p-6 bg-white border border-gray-200 shadow-sm rounded-3xl relative group hover:border-[var(--brand-pink)] transition duration-300">
                 <h4 className="font-bold text-xl text-gray-900 mb-3">{addr.title}</h4>
                 <p className="text-gray-600 text-sm mb-4 leading-relaxed bg-gray-50 p-3 rounded-xl">{addr.address}</p>
                 
                 <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-500 font-bold bg-[#FFF8F3] px-3 py-1.5 rounded-lg border border-[var(--brand-yellow)] border-opacity-50">
                     📍 GPS: {parseFloat(addr.lat).toFixed(4)}, {parseFloat(addr.lng).toFixed(4)}
                   </span>
                 </div>

                 {/* Delete Button (Appears on hover) */}
                 <form action={deleteSavedAddress} className="absolute top-5 right-5 lg:opacity-0 group-hover:opacity-100 transition">
                    <input type="hidden" name="address_id" value={addr.id} />
                    <button type="submit" className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition shadow-sm" title="Delete Address">
                      🗑️
                    </button>
                 </form>
              </div>
            ))}
         </div>
      )}

      {/* Only show the form if they have less than 3 addresses */}
      {addresses.length < 3 ? (
        <AddressForm />
      ) : (
        <div className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-200">
           <span className="text-4xl mb-3 block opacity-50">🏠</span>
           <h4 className="font-bold text-gray-900 mb-1">Address Limit Reached</h4>
           <p className="text-gray-500 text-sm">You have saved the maximum of 3 addresses. Delete an old one to add a new one.</p>
        </div>
      )}
    </div>
  )
}
