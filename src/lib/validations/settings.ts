import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const settingsSchema = z.object({
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  footer_text: z.string().optional(),
  social_links: z.object({
    twitter: optionalHttpUrlSchema,
    linkedin: optionalHttpUrlSchema,
    github: optionalHttpUrlSchema,
  }),
  profile_image_url: optionalHttpUrlSchema,
  consultation_provider: z.enum(['upwork', 'fiverr', 'calendly']).optional(),
  consultation_link_upwork: optionalHttpUrlSchema,
  consultation_link_fiverr: optionalHttpUrlSchema,
  consultation_link_calendly: optionalHttpUrlSchema,
  openai_api_key: z.string().optional().or(z.literal('')),
  anthropic_api_key: z.string().optional().or(z.literal('')),
  gemini_api_key: z.string().optional().or(z.literal('')),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
