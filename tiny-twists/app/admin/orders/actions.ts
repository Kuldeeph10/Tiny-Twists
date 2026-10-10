'use server'
import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('order_id') as string
  const newStatus = formData.get('status') as string

  // Make sure they are admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
  revalidatePath('/admin/orders')
}

export async function updatePaymentStatus(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('order_id') as string
  const newStatus = formData.get('payment_status') as string

  // Make sure they are admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await supabase.from('orders').update({ payment_status: newStatus }).eq('id', orderId)
  revalidatePath('/admin/orders')
}
