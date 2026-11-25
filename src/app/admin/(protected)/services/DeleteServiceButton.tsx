'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteService } from './actions'

export function DeleteServiceButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    setIsDeleting(true)
    try {
      const res = await deleteService(id)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }
    } catch {
      alert('Failed to delete service')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isDeleting}
      onClick={handleDelete}
      aria-label={`Delete ${title}`}
      className="text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50 transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
