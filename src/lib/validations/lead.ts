import { z } from 'zod'

export const leadSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Name is required').max(150, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  phone: z.string().trim().max(40, 'Phone number is too long').optional().default(''),
  company: z.string().trim().max(200, 'Company name is too long').optional().default(''),
  message: z.string().trim().max(5000, 'Message is too long').optional().default(''),
  status: z.enum(['new', 'contacted', 'closed']).default('new'),
  website: z.string().max(500).optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
