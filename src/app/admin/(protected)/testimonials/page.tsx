import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getAdminTestimonials } from './actions'
import { SortableList } from './SortableList'
import { SeedButton } from './SeedButton'

export const dynamic = 'force-dynamic'

export default async function TestimonialsAdminPage() {
  const { data: testimonials, error } = await getAdminTestimonials()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Manage client reviews, ratings, and social proof."
        actions={
          <>
            <SeedButton />
            <Button asChild>
              <Link href="/admin/testimonials/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Testimonial
              </Link>
            </Button>
          </>
        }
      />

      {error && <AdminErrorBanner title="Failed to load testimonials" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SortableList initialItems={testimonials || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
