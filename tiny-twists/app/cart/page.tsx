import { createClient } from '../../lib/supabase/server'
import CartView from './CartView'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const supabase = await createClient()
  
  // 1. Fetch Auth User
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Fetch Customer Profile & Addresses
  let customer = null
  let addresses = []
  
  if (user) {
    const { data } = await supabase.from('customers').select('*').eq('auth_id', user.id).single()
    customer = data
    if (data?.saved_addresses) {
      addresses = data.saved_addresses
    }
  }

  // Pass data securely down to the Client View component
  return <CartView userEmail={user?.email} customer={customer} savedAddresses={addresses} />
}
