import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const settingsSchema = z.object({
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  footer_text: z.string().optional(),
  admin_brand_name: z
    .string()
    .trim()
    .max(60, 'Brand name must be 60 characters or fewer')
    .optional()
    .or(z.literal('')),
  admin_brand_subtitle: z
    .string()
    .trim()
    .max(80, 'Subtitle must be 80 characters or fewer')
    .optional()
    .or(z.literal('')),
  admin_logo_url: optionalHttpUrlSchema,
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
