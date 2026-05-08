import { getTestimonial } from '../actions'
import { TestimonialForm } from '../TestimonialForm'
import { notFound } from 'next/navigation'

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const { data: testimonial, error } = await getTestimonial(params.id)

  if (error || !testimonial) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Testimonial</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update existing client testimonial.</p>
      </div>
      <TestimonialForm initialData={testimonial} />
    </div>
  )
}
