'use client'

import { LogOut } from 'lucide-react'
import { logout } from '../login/actions'

interface LogoutButtonProps {
  collapsed?: boolean
  onHoverTooltip?: (label: string | null, rect?: DOMRect) => void
}

export function LogoutButton({ collapsed = false, onHoverTooltip }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => await logout()}
      aria-label="Sign out"
      onMouseEnter={(e) => {
        if (collapsed && onHoverTooltip) {
          onHoverTooltip('Sign out', e.currentTarget.getBoundingClientRect())
        }
      }}
      onMouseLeave={() => {
        if (collapsed && onHoverTooltip) {
          onHoverTooltip(null)
        }
      }}
      className={`flex items-center transition-colors ${
        collapsed
          ? 'h-9 w-9 mx-auto justify-center rounded-xl text-adm-muted hover:text-adm-danger-text hover:bg-adm-danger-bg'
          : 'w-full px-3 py-2 rounded-lg text-sm font-medium text-adm-danger-text hover:bg-adm-danger-bg'
      }`}
    >
      <LogOut className={`h-[18px] w-[18px] shrink-0 ${collapsed ? '' : 'mr-3'}`} />
      {!collapsed && <span>Sign out</span>}
    </button>
  )
}
