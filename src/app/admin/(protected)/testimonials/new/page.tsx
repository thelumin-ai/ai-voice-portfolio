import { TestimonialForm } from '../TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Testimonial</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new client testimonial.</p>
      </div>
      <TestimonialForm />
    </div>
  )
}
