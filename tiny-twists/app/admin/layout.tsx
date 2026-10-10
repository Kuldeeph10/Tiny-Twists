import { createClient } from '../../lib/supabase/server'
import SidebarWrapper from './SidebarWrapper'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  let isAdmin = false;
  
  // Verify if a user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if this specific user is an Admin
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .single()
      
    if (data) {
      isAdmin = true;
    }
  }

  // The SidebarWrapper handles hiding the sidebar on the login page or if they aren't an admin
  return <SidebarWrapper isAdmin={isAdmin}>{children}</SidebarWrapper>
}
