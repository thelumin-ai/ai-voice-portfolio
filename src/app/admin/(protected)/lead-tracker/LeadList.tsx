'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateLeadStatus, deleteLead } from './actions'
import { Trash2, Mail, Phone, Building, Users } from 'lucide-react'

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

export function LeadList({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setIsUpdating(true)
    const result = await updateLeadStatus(id, newStatus)
    
    if (result.success) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead))
    } else {
      alert('Failed to update lead status')
    }
    setIsUpdating(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setIsUpdating(true)
      const result = await deleteLead(id)
      
      if (result.success) {
        setLeads(leads.filter(lead => lead.id !== id))
      } else {
        alert('Failed to delete lead')
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

  return (
    <div className={`space-y-4 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {leads.map(lead => (
        <div key={lead.id} className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm group hover:border-zinc-700/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row h-full">
            
            {/* Status indicator bar */}
            <div className={`w-full md:w-2 ${
              lead.status === 'new' ? 'bg-blue-500' : 
              lead.status === 'contacted' ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`} />

            <div className="flex-1 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{lead.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-zinc-500" />
                      <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors">{lead.email}</a>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">{lead.phone}</a>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{lead.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/50">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>

              {lead.message && (
                <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-sm text-zinc-300 leading-relaxed shadow-inner">
                  "{lead.message}"
                </div>
              )}
            </div>

            <div className="bg-zinc-950/30 p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-zinc-800/50 md:w-56 backdrop-blur-sm">
              <div className="w-full space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Status</label>
                <select 
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                  className="w-full px-3 py-2.5 text-sm border rounded-lg bg-zinc-900 border-zinc-700 font-medium text-white shadow-inner focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="new">🟢 New Lead</option>
                  <option value="contacted">🟡 Contacted</option>
                  <option value="closed">✔️ Closed / Won</option>
                </select>
              </div>

              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 w-full border border-transparent hover:border-red-900/50 transition-all" onClick={() => handleDelete(lead.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Lead
              </Button>
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}
