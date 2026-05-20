'use client'

import { useState, useTransition } from 'react'
import { seedDefaultTestimonials } from './actions'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { DatabaseBackup } from 'lucide-react'

export function SeedButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSeed = () => {
    const confirmSeed = window.confirm(
      "Are you sure you want to clear all existing testimonials and load the 6 default testimonials? This will replace any mock/test testimonials currently in the database."
    )

    if (!confirmSeed) return

    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        const result = await seedDefaultTestimonials()
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess(true)
          router.refresh()
          setTimeout(() => setSuccess(false), 3000)
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong while seeding testimonials.')
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={handleSeed}
        disabled={isPending}
        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        <DatabaseBackup className="w-4 h-4 mr-2" />
        {isPending ? 'Seeding...' : 'Seed Defaults'}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {success && <span className="text-xs text-green-500 font-medium">Default testimonials loaded!</span>}
    </div>
  )
}
