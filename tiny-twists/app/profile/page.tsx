import { createClient } from '../../lib/supabase/server'
import { updateProfileSettings, sendPasswordReset } from './actions'

export const dynamic = 'force-dynamic'

export default async function ProfileSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: customer } = await supabase.from('customers').select('name, phone').eq('auth_id', user?.id).single()

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-gray-900 mb-8 border-b pb-4">Profile Settings</h3>
      
      <form action={updateProfileSettings} className="flex flex-col gap-6 max-w-xl">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Email Address (Login)</label>
          <input type="email" value={user?.email || ''} disabled className="w-full px-5 py-4 bg-gray-100 border-none rounded-2xl text-gray-500 font-medium cursor-not-allowed shadow-inner" />
          <p className="text-xs text-gray-400 mt-2 font-bold">Your secure login email cannot be changed here.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
          <input name="name" type="text" defaultValue={customer?.name || ''} required placeholder="Your full name" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">WhatsApp / Phone Number</label>
          <input name="phone" type="tel" defaultValue={customer?.phone || ''} required placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-medium focus:ring-4 focus:ring-[var(--brand-pink)] outline-none transition" />
        </div>
        
        <button type="submit" className="mt-4 px-8 py-4 bg-[var(--brand-pink)] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition transform text-lg">
          Save Changes
        </button>
      </form>

      <div className="mt-12 pt-10 border-t border-gray-100 max-w-xl">
        <h4 className="text-xl font-serif font-bold text-gray-900 mb-4">Security & Password</h4>
        <div className="bg-[#FFF8F3] p-6 rounded-3xl border border-[var(--brand-yellow)] border-opacity-30">
           <p className="text-sm text-gray-700 font-medium mb-5 leading-relaxed">
             Need to change your password? Click the button below, and we will immediately send a secure <strong>OTP / Password Reset link</strong> to your registered email address: <br/><span className="font-bold text-[var(--brand-pink)] mt-1 block">{user?.email}</span>
           </p>
           <form action={sendPasswordReset}>
              <button type="submit" className="w-full sm:w-auto px-6 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:shadow-md hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                <span>📧</span> Send Password Reset Email
              </button>
           </form>
        </div>
      </div>
    </div>
  )
}
