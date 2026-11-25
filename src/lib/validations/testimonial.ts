import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const testimonialSchema = z.object({
  id: z.string().optional(),
  client_name: z.string().min(1, 'Client name is required'),
  company: z.string().optional(),
  content: z.string().min(1, 'Testimonial content is required'),
  image_url: optionalHttpUrlSchema,
  video_url: optionalHttpUrlSchema,
  rating: z.number().min(1).max(5),
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int(),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
