'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DatabaseBackup } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { seedDefaultUseCases } from './actions'

export function SeedUseCasesButton() {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await seedDefaultUseCases()
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('All 12 use cases synced to database')
          setConfirmOpen(false)
          router.refresh()
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'Failed to sync default use cases'))
      }
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
      >
        <DatabaseBackup className="w-4 h-4 mr-2" />
        {isPending ? 'Syncing...' : 'Sync All 12 Defaults'}
      </Button>

      <AdminConfirmDialog
        open={confirmOpen}
        title="Sync missing default use cases?"
        description="This adds any missing built-in industry & capability use cases without overwriting existing edited records."
        confirmLabel="Sync Defaults"
        destructive={false}
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
