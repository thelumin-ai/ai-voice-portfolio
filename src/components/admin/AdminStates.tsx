'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminErrorBannerProps {
  title?: string
  message: string
  showRetry?: boolean
  className?: string
}

const SCHEMA_HINT_PATTERNS = [
  'does not exist',
  'relation',
  'column',
  'permission denied',
  'row-level security',
  'schema cache',
]

export function AdminErrorBanner({
  title = 'Unable to load records',
  message,
  showRetry = true,
  className = '',
}: AdminErrorBannerProps) {
  const router = useRouter()
  const lower = message.toLowerCase()
  const needsSchemaHint = SCHEMA_HINT_PATTERNS.some((pattern) => lower.includes(pattern))

  return (
    <div
      role="alert"
      className={`rounded-xl border border-adm-danger-border bg-adm-danger-bg p-4 text-adm-danger-text ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="min-w-0 space-y-1">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-sm opacity-90 break-words">{message}</p>
            {needsSchemaHint && (
              <p className="text-xs opacity-80 pt-1">
                Tip: Run <code className="font-mono underline">src/lib/supabase-admin-setup.sql</code> in your Supabase SQL Editor to ensure all admin tables and RLS policies exist.
              </p>
            )}
          </div>
        </div>
        {showRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
            className="self-start shrink-0 border-adm-danger-border bg-adm-surface/80 text-adm-danger-text hover:bg-adm-surface"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}

interface AdminEmptyStateProps {
  icon: LucideIcon | React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function AdminEmptyState({ icon, title, description, action }: AdminEmptyStateProps) {
  const renderedIcon = React.isValidElement(icon)
    ? icon
    : typeof icon === 'function' || (typeof icon === 'object' && icon !== null)
    ? React.createElement(icon as LucideIcon, { className: 'h-6 w-6' })
    : null

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-adm-border bg-adm-surface/60 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-adm-border bg-adm-surface-2 text-adm-muted">
        {renderedIcon}
      </div>
      <h3 className="text-base font-semibold text-adm-text">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-adm-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function AdminStatusBadge({ status }: { status?: string | null }) {
  const normalized = (status || 'draft').toLowerCase()

  let palette = 'border-adm-border bg-adm-surface-2 text-adm-muted'
  if (normalized === 'published' || normalized === 'closed') {
    palette = 'border-adm-success-border bg-adm-success-bg text-adm-success-text'
  } else if (normalized === 'draft' || normalized === 'contacted') {
    palette = 'border-adm-warn-border bg-adm-warn-bg text-adm-warn-text'
  } else if (normalized === 'new') {
    palette = 'border-adm-info-border bg-adm-info-bg text-adm-info-text'
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${palette}`}
    >
      {normalized}
    </span>
  )
}

interface AdminConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adm-confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-adm-border bg-adm-surface p-6 text-adm-text shadow-2xl"
      >
        <h3 id="adm-confirm-title" className="text-lg font-semibold text-adm-text">
          {title}
        </h3>
        <p className="mt-2 text-sm text-adm-muted leading-relaxed">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
