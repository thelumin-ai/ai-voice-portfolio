import { getTestimonials } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SortableList } from './SortableList'

export default async function TestimonialsAdminPage() {
  const { data: testimonials } = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableList initialItems={testimonials || []} />
        </CardContent>
      </Card>
    </div>
  )
}
