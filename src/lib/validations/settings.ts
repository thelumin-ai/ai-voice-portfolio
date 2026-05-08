import { z } from "zod"

export const settingsSchema = z.object({
  contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  footer_text: z.string().optional(),
  social_links: z.object({
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
