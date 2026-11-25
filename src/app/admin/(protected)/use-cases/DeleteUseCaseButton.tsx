'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { deleteUseCase } from './actions'

export function DeleteUseCaseButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteUseCase(id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Deleted "${name}"`)
        setConfirmOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Failed to delete use case')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isDeleting}
        onClick={() => setConfirmOpen(true)}
        aria-label={`Delete ${name}`}
        className="text-adm-danger-text hover:bg-adm-danger-bg hover:border-adm-danger-border"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <AdminConfirmDialog
        open={confirmOpen}
        title="Delete use case?"
        description={`This will permanently remove "${name}" from your industry use cases.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
