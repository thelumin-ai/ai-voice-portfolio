import { z } from "zod"

export const settingsSchema = z.object({
  contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  footer_text: z.string().optional(),
  social_links: z.object({
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
  profile_image_url: z.string().optional().or(z.literal("")),
  consultation_provider: z.enum(['upwork', 'fiverr', 'calendly']).default('upwork'),
  consultation_link_upwork: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  consultation_link_fiverr: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  consultation_link_calendly: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  openai_api_key: z.string().optional().or(z.literal("")),
  anthropic_api_key: z.string().optional().or(z.literal("")),
  gemini_api_key: z.string().optional().or(z.literal("")),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
