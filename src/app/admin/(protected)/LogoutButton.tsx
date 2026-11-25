'use client'

import { LogOut } from 'lucide-react'
import { logout } from '../login/actions'

export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <button
      type="button"
      onClick={async () => await logout()}
      title={collapsed ? 'Sign out' : undefined}
      aria-label="Sign out"
      className={`flex w-full items-center ${
        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'
      } text-sm font-medium rounded-lg text-adm-danger-text hover:bg-adm-danger-bg transition-colors`}
    >
      <LogOut className={`h-4 w-4 shrink-0 ${collapsed ? '' : 'mr-3'}`} />
      {!collapsed && <span>Sign out</span>}
    </button>
  )
}
