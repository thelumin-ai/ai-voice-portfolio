import { z } from "zod"

export const techStackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  icon_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["published", "draft", "archived"]),
  display_order: z.number().int(),
})

export type TechStackFormValues = z.infer<typeof techStackSchema>
