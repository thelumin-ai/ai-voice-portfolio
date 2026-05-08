'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteSeoSetting } from './actions'
import { Trash2, Edit, Globe } from 'lucide-react'
import Link from 'next/link'

interface SeoSetting {
  id: string
  page_path: string
  title: string
  description: string
}

export function SeoList({ initialSettings }: { initialSettings: SeoSetting[] }) {
  const [settings, setSettings] = useState(initialSettings)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SEO setting?')) {
      setIsUpdating(true)
      const result = await deleteSeoSetting(id)
      
      if (result.success) {
        setSettings(settings.filter(s => s.id !== id))
      } else {
        alert('Failed to delete SEO setting')
      }
      setIsUpdating(false)
    }
  }

  if (settings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No SEO settings found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Click "Add Route SEO" to configure meta tags for a page.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      {settings.map(setting => (
        <Card key={setting.id}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-gray-400" />
                <h3 className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">{setting.page_path}</h3>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">{setting.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{setting.description}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/seo/${setting.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => handleDelete(setting.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
