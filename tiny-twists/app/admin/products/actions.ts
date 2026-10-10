'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000)

  const imageFiles = formData.getAll('images') as File[]
  const imageUrls: string[] = []

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
        
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        imageUrls.push(data.publicUrl)
      }
    }
  }

  const productData = {
    name,
    slug,
    category_id: formData.get('category_id') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    cost: parseFloat(formData.get('cost') as string),
    stock: parseInt(formData.get('stock') as string) || 0,
    made_to_order: formData.get('made_to_order') === 'on',
    is_active: true,
    image_url: imageUrls.length > 0 ? imageUrls[0] : null,
    images: imageUrls
  }

  await supabase.from('products').insert([productData])
  
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

// --------------------------------------------------------------------------
// PHASE 3 ACTIONS: Edit and Delete
// --------------------------------------------------------------------------

export async function editProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const id = formData.get('id') as string
  
  const updateData: any = {
    name: formData.get('name') as string,
    category_id: formData.get('category_id') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    cost: parseFloat(formData.get('cost') as string),
    stock: parseInt(formData.get('stock') as string) || 0,
    made_to_order: formData.get('made_to_order') === 'on',
  }

  // Parse the images that the user did not delete
  let keptImages: string[] = []
  try {
    keptImages = JSON.parse((formData.get('kept_images') as string) || '[]')
  } catch(e) {}

  // Handle new multiple images upload
  const imageFiles = formData.getAll('images') as File[]
  const newImageUrls: string[] = []

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `updated-${id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
        
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        newImageUrls.push(data.publicUrl)
      }
    }
  }
  
  // Combine them!
  const allImages = [...keptImages, ...newImageUrls]
  
  if (allImages.length > 0) {
    updateData.images = allImages
    updateData.image_url = allImages[0]
  } else {
    // If they deleted everything and uploaded nothing, set to null/empty
    updateData.images = []
    updateData.image_url = null
  }

  await supabase.from('products').update(updateData).eq('id', id)
  
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  // Actually delete it from database
  await supabase.from('products').delete().eq('id', id)
  
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function toggleProductStatus(formData: FormData) {
  const supabase = await createClient()
  const productId = formData.get('product_id') as string
  const currentStatus = formData.get('current_status') === 'true'

  await supabase
    .from('products')
    .update({ is_active: !currentStatus })
    .eq('id', productId)

  revalidatePath('/admin/products')
}
