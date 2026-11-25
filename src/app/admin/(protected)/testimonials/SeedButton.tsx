'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DatabaseBackup } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/components/admin/AdminStates'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { seedDefaultTestimonials } from './actions'

export function SeedButton() {
  const router = useRouter()
  const toast = useAdminToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await seedDefaultTestimonials()
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('6 default testimonials loaded')
          setConfirmOpen(false)
          router.refresh()
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'Failed to seed testimonials'))
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
        title="Replace testimonials with defaults?"
        description="This will replace all existing testimonials with the 6 starter client reviews."
        confirmLabel="Load Defaults"
        destructive={false}
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
