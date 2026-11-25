import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel,
  badge,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="adm-surface adm-card-pad">
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted transition-colors hover:text-adm-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{backLabel || 'Back'}</span>
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-adm-text">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-sm text-adm-muted">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
