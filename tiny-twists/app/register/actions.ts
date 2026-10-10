'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function registerCustomer(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Create the user securely in Supabase Authentication
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    redirect(`/register?error=${authError.message}`)
  }

  // 2. Save their public details (name, phone) to your Customers database table
  // We use the service_role key to bypass RLS for this specific automated step
  if (authData.user) {
    const { createClient: createAdminClient } = await import('@supabase/supabase-js')
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    await adminSupabase.from('customers').insert({
      name: name,
      phone: phone,
      auth_id: authData.user.id
    })
  }
  
  // Send them to the login page with a success message!
  redirect('/login?message=Account created successfully! You can now log in.')
}
