'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SaaSLogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/saas/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2.5 px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/40 rounded-xl transition-all text-xs font-semibold cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  )
}
