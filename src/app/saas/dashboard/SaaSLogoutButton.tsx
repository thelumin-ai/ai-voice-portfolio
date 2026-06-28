'use client'

import { LogOut } from 'lucide-react'
import { logout } from '../login/actions'

export function SaaSLogoutButton() {
  return (
    <button
      onClick={async () => await logout()}
      className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-semibold rounded-md transition-colors cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      <span>Log Out</span>
    </button>
  )
}
