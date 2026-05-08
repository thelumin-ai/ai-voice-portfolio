'use client'

import { LogOut } from 'lucide-react'
import { logout } from './login/actions'

export function LogoutButton() {
  return (
    <button
      onClick={async () => await logout()}
      className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <LogOut className="mr-3 h-5 w-5" />
      Sign out
    </button>
  )
}
