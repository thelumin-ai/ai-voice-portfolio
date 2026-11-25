'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Check, Moon, Palette, RotateCcw, Settings2, Sun, X } from 'lucide-react'
import {
  ADMIN_ACCENT_OPTIONS,
  AdminDensity,
  AdminMode,
} from '@/lib/admin/preferences'
import { useAdminPreferences } from './AdminPreferencesContext'
import { Button } from '@/components/ui/button'

interface AdminAppearanceDrawerProps {
  open: boolean
  onClose: () => void
}

export function AdminAppearanceDrawer({ open, onClose }: AdminAppearanceDrawerProps) {
  const {
    preferences,
    setMode,
    setAccent,
    setDensity,
    setSidebarCollapsed,
    resetAppearance,
  } = useAdminPreferences()

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Customize appearance"
        className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-adm-border bg-adm-surface text-adm-text shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-adm-border px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-adm-accent-soft text-adm-accent">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-adm-text">Customize Workspace</h2>
              <p className="text-xs text-adm-muted">Saved automatically to your browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close appearance drawer"
            className="rounded-lg p-1.5 text-adm-muted transition-colors hover:bg-adm-surface-2 hover:text-adm-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* Theme Mode */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
              Theme Mode
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = preferences.mode === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id as AdminMode)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'border-adm-accent bg-adm-accent-soft text-adm-accent'
                        : 'border-adm-border bg-adm-surface-2/60 text-adm-muted hover:text-adm-text'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
              Accent Color
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ADMIN_ACCENT_OPTIONS.map((opt) => {
                const active = preferences.accent === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccent(opt.id)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'border-adm-accent bg-adm-accent-soft text-adm-text'
                        : 'border-adm-border bg-adm-surface-2/60 text-adm-muted hover:text-adm-text'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-3.5 w-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: opt.swatch }}
                      />
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 text-adm-accent shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Density */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
              Interface Density
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { id: 'comfortable', label: 'Comfortable' },
                  { id: 'compact', label: 'Compact' },
                ] as const
              ).map((item) => {
                const active = preferences.density === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDensity(item.id as AdminDensity)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'border-adm-accent bg-adm-accent-soft text-adm-accent'
                        : 'border-adm-border bg-adm-surface-2/60 text-adm-muted hover:text-adm-text'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sidebar Layout */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-adm-muted">
              Desktop Sidebar
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { collapsed: false, label: 'Expanded' },
                { collapsed: true, label: 'Compact Rail' },
              ].map((item) => {
                const active = preferences.sidebarCollapsed === item.collapsed
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSidebarCollapsed(item.collapsed)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'border-adm-accent bg-adm-accent-soft text-adm-accent'
                        : 'border-adm-border bg-adm-surface-2/60 text-adm-muted hover:text-adm-text'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Admin Branding Shortcut */}
          <div className="rounded-xl border border-adm-border bg-adm-surface-2/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
              <Settings2 className="h-4 w-4 text-adm-accent" />
              <span>Admin Logo &amp; Brand Name</span>
            </div>
            <p className="text-xs text-adm-muted leading-relaxed">
              Customize the panel title, subtitle, and logo in Site Settings.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full mt-2" onClick={onClose}>
              <Link href="/admin/settings#admin-branding">Edit Branding in Settings</Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-adm-border p-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={resetAppearance}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Appearance
          </Button>
        </div>
      </aside>
    </div>
  )
}
