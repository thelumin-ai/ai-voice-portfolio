'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { updateLeadStatus, deleteLead } from './actions'
import { Trash2, Mail, Phone, Building, Users, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string | null
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

const PAGE_SIZE = 10

export function LeadList({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLeads(initialLeads)
  }, [initialLeads])

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setIsUpdating(true)
    setActionError(null)
    const result = await updateLeadStatus(id, newStatus)

    if (result.success) {
      setLeads((prev) => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead))
    } else {
      setActionError(result.error || 'Failed to update lead status')
    }
    setIsUpdating(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setIsUpdating(true)
      setActionError(null)
      const result = await deleteLead(id)

      if (result.success) {
        setLeads((prev) => prev.filter(lead => lead.id !== id))
      } else {
        setActionError(result.error || 'Failed to delete lead')
      }
      setIsUpdating(false)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-lg font-medium text-zinc-200 mb-2">No Leads Yet</h3>
        <p className="text-zinc-500 max-w-sm mx-auto">When users submit the contact form, they will appear here.</p>
      </div>
    )
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false
    if (!query) return true
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.company || '').toLowerCase().includes(query) ||
      (lead.message || '').toLowerCase().includes(query)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between gap-3">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="p-1 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/50">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search leads by name, email, company, or message..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | Lead['status'])
            setPage(1)
          }}
          aria-label="Filter leads by status"
          className="px-3 py-2 text-sm rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-blue-500 shrink-0"
        >
          <option value="all">All Statuses ({leads.length})</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed / Won</option>
        </select>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="p-10 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-zinc-400 text-sm">
          No leads match your current filter.
        </div>
      ) : (
        <div className={`space-y-4 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
          {paginatedLeads.map(lead => (
            <div key={lead.id} className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm group hover:border-zinc-700/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Status indicator bar */}
                <div className={`h-2 md:h-auto w-full md:w-2 shrink-0 ${
                  lead.status === 'new' ? 'bg-blue-500' :
                  lead.status === 'contacted' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`} />

                <div className="flex-1 p-5 sm:p-6 space-y-4 min-w-0">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors break-words">{lead.name}</h3>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                          <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors truncate">{lead.email}</a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                            <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">{lead.phone}</a>
                          </div>
                        )}
                        {lead.company && (
                          <div className="flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-zinc-500 shrink-0" />
                            <span className="text-zinc-300">{lead.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50 shrink-0">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {lead.message && (
                    <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-sm text-zinc-300 leading-relaxed shadow-inner whitespace-pre-wrap break-words">
                      {lead.message}
                    </div>
                  )}
                </div>

                <div className="bg-zinc-950/30 p-5 sm:p-6 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-end md:items-stretch justify-between md:justify-center gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-zinc-800/50 md:w-56 shrink-0 backdrop-blur-sm">
                  <div className="w-full space-y-2">
                    <label htmlFor={`lead-status-${lead.id}`} className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Status</label>
                    <select
                      id={`lead-status-${lead.id}`}
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className="w-full px-3 py-2.5 text-sm border rounded-lg bg-zinc-900 border-zinc-700 font-medium text-white shadow-inner focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed / Won</option>
                    </select>
                  </div>

                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 w-full border border-transparent hover:border-red-900/50 transition-all shrink-0" onClick={() => handleDelete(lead.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Lead
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
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
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
