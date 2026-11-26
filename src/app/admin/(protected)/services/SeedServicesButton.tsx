'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DatabaseBackup } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { seedDefaultServices } from './actions'

export function SeedServicesButton() {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await seedDefaultServices()
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('7 default services loaded')
          setConfirmOpen(false)
          router.refresh()
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'Failed to seed services'))
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
        {isPending ? 'Seeding...' : 'Seed Defaults'}
      </Button>

      <AdminConfirmDialog
        open={confirmOpen}
        title="Load default homepage services?"
        description="This will load the 7 core AI voice & automation service cards so you can edit, reorder, or customize them."
        confirmLabel="Load Services"
        destructive={false}
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
