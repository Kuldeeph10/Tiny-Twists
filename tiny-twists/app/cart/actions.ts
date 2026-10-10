'use server'

import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { CartItem } from '../../components/CartProvider'

export async function placeOrder(cartItems: CartItem[], total: number, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const notes = formData.get('notes') as string
  const lat = formData.get('lat') as string
  const lng = formData.get('lng') as string

  // 1. Create or Find Customer Record
  const { data: { user } } = await supabase.auth.getUser()
  
  let customerId = null
  
  if (user) {
    // Look for existing customer
    const { data: existingCust } = await supabase.from('customers').select('*').eq('auth_id', user.id).single()
    if (existingCust) {
      customerId = existingCust.id
      // Update their root address just in case
      await supabase.from('customers').update({ address, phone, name }).eq('id', customerId)
    }
  }

  if (!customerId) {
    const { data: customerData, error: custError } = await supabase
      .from('customers')
      .insert([{ name, phone, address, auth_id: user?.id || null }])
      .select('id')
      .single()

    if (custError || !customerData) {
      console.error(custError)
      throw new Error('Failed to save customer details.')
    }
    customerId = customerData.id
  }

  // 2. Create the Order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id: customerId,
      status: 'new',
      total,
      payment_status: 'unpaid', // Cash on delivery
      notes,
      delivery_address: address, // NEW COLUMN
      delivery_lat: lat || null, // NEW COLUMN
      delivery_lng: lng || null  // NEW COLUMN
    }])
    .select('id')
    .single()

  if (orderError || !orderData) {
    console.error(orderError)
    throw new Error('Failed to create order.')
  }

  const orderId = orderData.id

  // 3. Insert Order Items
  const orderItemsData = cartItems.map(item => ({
    order_id: orderId,
    product_id: item.id,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error(itemsError)
    throw new Error('Failed to save order items.')
  }

  // 4. Generate WhatsApp message for the success page
  let message = `Hello Tiny Twists! 🎀\nI'd like to place a new order (Order ID: ${orderId.slice(0, 6)}):\n\n`
  cartItems.forEach(item => {
    message += `- ${item.quantity}x ${item.name} (₹${item.price})\n`
  })
  message += `\n*Total:* ₹${total}\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n*Notes:* ${notes || 'None'}\n\nPayment Method: Cash on Delivery`

  // Redirect to success page (which will clear the cart locally)
  redirect(`/cart/success?msg=${encodeURIComponent(message)}`)
}
