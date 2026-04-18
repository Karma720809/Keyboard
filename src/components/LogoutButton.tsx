'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout} 
      className="hidden sm:block text-[13px] font-medium text-white/70 hover:text-white transition-colors"
    >
      Log out
    </button>
  )
}
