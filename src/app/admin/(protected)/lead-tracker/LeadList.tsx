'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateLeadStatus, deleteLead } from './actions'
import { Trash2, Mail, Phone, Building } from 'lucide-react'

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
      <div className="text-center py-12 border border-dashed rounded-lg dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No leads yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">When users submit the contact form, they will appear here.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {leads.map(lead => (
        <Card key={lead.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row border-l-4" style={{ 
              borderLeftColor: lead.status === 'new' ? '#3b82f6' : lead.status === 'contacted' ? '#eab308' : '#22c55e'
            }}>
              
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lead.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${lead.email}`} className="hover:underline text-blue-600 dark:text-blue-400">{lead.email}</a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${lead.phone}`} className="hover:underline text-blue-600 dark:text-blue-400">{lead.phone}</a>
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>

                {lead.message && (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-md border dark:border-zinc-800 text-sm">
                    {lead.message}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l dark:border-zinc-800 md:w-48">
                <div className="w-full space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Status</label>
                  <select 
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border rounded-md dark:bg-zinc-800 dark:border-zinc-700 font-medium"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed / Won</option>
                  </select>
                </div>

                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 w-full" onClick={() => handleDelete(lead.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
