import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TestimonialForm } from '../TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Testimonial"
        description="Create a new client review or social proof entry."
        backHref="/admin/testimonials"
        backLabel="Back to Testimonials"
      />

      <TestimonialForm />
    </div>
  )
}
