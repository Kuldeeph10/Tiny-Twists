'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  // Check if customer row exists for this auth user
  const { data: customer } = await supabase.from('customers').select('id').eq('auth_id', user.id).single()

  if (customer) {
    await supabase.from('customers').update({ name, phone }).eq('auth_id', user.id)
  } else {
    // Create new linked customer row
    await supabase.from('customers').insert([{ auth_id: user.id, name, phone }])
  }
  
  revalidatePath('/profile')
}

export async function saveNewAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const title = formData.get('title') as string
  const addressText = formData.get('address') as string
  const lat = formData.get('lat') as string
  const lng = formData.get('lng') as string

  const newAddress = {
    id: Date.now().toString(), // simple unique id
    title,
    address: addressText,
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  }

  const { data: customer } = await supabase.from('customers').select('saved_addresses').eq('auth_id', user.id).single()

  let currentAddresses = customer?.saved_addresses || []
  
  if (currentAddresses.length >= 3) {
    throw new Error("You can only save up to 3 addresses.")
  }

  const updatedList = [...currentAddresses, newAddress]

  if (customer) {
    await supabase.from('customers').update({ saved_addresses: updatedList }).eq('auth_id', user.id)
  } else {
    await supabase.from('customers').insert([{ auth_id: user.id, name: 'User', phone: '', saved_addresses: updatedList }])
  }
  
  revalidatePath('/profile/addresses')
}

export async function deleteSavedAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const addressId = formData.get('address_id') as string

  const { data: customer } = await supabase.from('customers').select('saved_addresses').eq('auth_id', user.id).single()
  if (!customer) return

  const updatedList = (customer.saved_addresses || []).filter((addr: any) => addr.id !== addressId)

  await supabase.from('customers').update({ saved_addresses: updatedList }).eq('auth_id', user.id)
  revalidatePath('/profile/addresses')
}

export async function sendPasswordReset() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) throw new Error("No user email found")

  // This triggers Supabase to send an OTP / Password Reset link to their email
  const { error } = await supabase.auth.resetPasswordForEmail(user.email)
  
  if (error) {
    console.error("Password reset error:", error)
    throw new Error(error.message)
  }
}

