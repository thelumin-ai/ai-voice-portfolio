import { z } from "zod"

export const leadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(["new", "contacted", "closed"]).default("new"),
})

export type LeadFormValues = z.infer<typeof leadSchema>
