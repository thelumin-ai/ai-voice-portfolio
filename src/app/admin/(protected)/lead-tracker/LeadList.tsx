'use client'

import { useState } from 'react'
import {
  Building,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteLead, updateLeadStatus } from './actions'

interface Lead {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  message?: string | null
  status?: 'new' | 'contacted' | 'closed' | string | null
  created_at?: string | null
}

const PAGE_SIZE = 10

function formatLeadDate(raw: string | null | undefined): string {
  if (!raw) return '—'
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

export function LeadList({
  initialLeads,
  hasFetchError = false,
}: {
  initialLeads: Lead[]
  hasFetchError?: boolean
}) {
  const [leads, setLeads] = useState(initialLeads)
  const [prevInitial, setPrevInitial] = useState(initialLeads)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all')
  const [page, setPage] = useState(1)
  const toast = useAdminToast()

  if (prevInitial !== initialLeads) {
    setPrevInitial(initialLeads)
    setLeads(initialLeads)
  }

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setUpdatingId(id)
    try {
      const result = await updateLeadStatus(id, newStatus)
      if (result.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        )
        toast.success(`Lead status marked "${newStatus}"`)
      } else {
        toast.error(result.error || 'Failed to update lead status')
      }
    } catch {
      toast.error('Failed to update lead status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const result = await deleteLead(deleteTarget.id)
      if (result.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== deleteTarget.id))
        toast.success(`Deleted lead "${deleteTarget.name || deleteTarget.email || ''}"`)
        setDeleteTarget(null)
      } else {
        toast.error(result.error || 'Failed to delete lead')
      }
    } catch {
      toast.error('Failed to delete lead')
    } finally {
      setIsDeleting(false)
    }
  }

  if (leads.length === 0) {
    if (hasFetchError) {
      return (
        <div className="adm-surface adm-card-pad text-center text-sm text-adm-muted">
          Fix the error above and click Retry to load leads.
        </div>
      )
    }
    return (
      <div className="adm-surface adm-card-pad">
        <AdminEmptyState
          icon={Users}
          title="No leads yet"
          description="Inbound submissions from your website contact form or cost estimator will appear here."
        />
      </div>
    )
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredLeads = leads.filter((lead) => {
    const normalizedStatus = (lead.status || 'new').toLowerCase()
    if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false
    if (!query) return true
    return (
      (lead.name || '').toLowerCase().includes(query) ||
      (lead.email || '').toLowerCase().includes(query) ||
      (lead.company || '').toLowerCase().includes(query) ||
      (lead.message || '').toLowerCase().includes(query)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="space-y-4">
      <div className="adm-surface p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-adm-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search leads by name, email, company, or message..."
            className="adm-input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'new' | 'contacted' | 'closed')
            setPage(1)
          }}
          aria-label="Filter leads by status"
          className="adm-input sm:w-48 shrink-0"
        >
          <option value="all">All Statuses ({leads.length})</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed / Won</option>
        </select>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="adm-surface p-8 text-center text-sm text-adm-muted">
          No leads match your current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedLeads.map((lead) => {
            const leadName = lead.name?.trim() || 'Unknown Contact'
            const leadEmail = lead.email?.trim() || ''
            const leadStatus =
              lead.status === 'contacted' || lead.status === 'closed' ? lead.status : 'new'
            const barClass =
              leadStatus === 'new'
                ? 'bg-adm-accent'
                : leadStatus === 'contacted'
                ? 'bg-amber-500'
                : 'bg-emerald-500'

            return (
              <div key={lead.id} className="adm-surface overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className={`h-1.5 md:h-auto w-full md:w-1.5 shrink-0 ${barClass}`} />

                  <div className="flex-1 p-5 space-y-3 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-semibold text-adm-text break-words">
                            {leadName}
                          </h3>
                          <AdminStatusBadge status={leadStatus} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-adm-muted">
                          {leadEmail && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-adm-subtle shrink-0" />
                              <a
                                href={`mailto:${leadEmail}`}
                                className="hover:text-adm-text transition-colors truncate"
                              >
                                {leadEmail}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-adm-subtle shrink-0" />
                              <a
                                href={`tel:${lead.phone}`}
                                className="hover:text-adm-text transition-colors"
                              >
                                {lead.phone}
                              </a>
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-adm-subtle shrink-0" />
                              <span className="text-adm-text">{lead.company}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-adm-muted bg-adm-surface-2 px-2 py-1 rounded border border-adm-border shrink-0">
                        {formatLeadDate(lead.created_at)}
                      </span>
                    </div>

                    {lead.message && (
                      <div className="p-3.5 bg-adm-surface-2/60 rounded-lg border border-adm-border text-sm text-adm-text leading-relaxed whitespace-pre-wrap break-words">
                        {lead.message}
                      </div>
                    )}
                  </div>

                  <div className="bg-adm-surface-2/40 p-4 sm:p-5 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-end md:items-stretch justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-adm-border md:w-52 shrink-0">
                    <div className="w-full space-y-1.5">
                      <label
                        htmlFor={`lead-status-${lead.id}`}
                        className="text-xs font-semibold text-adm-muted uppercase tracking-wider block"
                      >
                        Status
                      </label>
                      <select
                        id={`lead-status-${lead.id}`}
                        value={leadStatus}
                        disabled={updatingId === lead.id}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value as 'new' | 'contacted' | 'closed'
                          )
                        }
                        className="adm-input"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed / Won</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(lead)}
                      className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border w-full shrink-0"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-adm-muted">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <span className="font-mono px-2">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete lead?"
        description={`This will permanently delete the lead from "${deleteTarget?.name || deleteTarget?.email || 'this contact'}".`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
