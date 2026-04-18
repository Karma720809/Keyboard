import Link from 'next/link'
import { Command } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { LogoutButton } from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="fixed top-0 w-full z-50 apple-nav py-3 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer">
          <Command className="w-5 h-5" />
          <span className="font-semibold text-lg tracking-tight">Aura Pro</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/community" className="hidden sm:block text-[13px] font-medium text-white/70 hover:text-white transition-colors">
            Community
          </Link>

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/auth" className="hidden sm:block text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
          )}

          <button className="bg-[#f5f5f7] text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors">
            Pre-order
          </button>
        </div>
      </div>
    </header>
  )
}
