import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getTestimonial } from '../actions'
import { TestimonialForm } from '../TestimonialForm'

export const dynamic = 'force-dynamic'

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: testimonial, error } = await getTestimonial(resolvedParams.id)

  if (error || !testimonial) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Testimonial"
        description={`Updating review from "${testimonial.client_name || 'Client'}"`}
        backHref="/admin/testimonials"
        backLabel="Back to Testimonials"
      />

      <TestimonialForm initialData={testimonial} />
    </div>
  )
}
