'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { serviceSchema, ServiceFormValues } from '@/lib/validations/service'
import { requireAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'

function isMissingLinkColumnError(message?: string): boolean {
  if (!message) return false
  const lower = message.toLowerCase()
  return lower.includes('link') && (lower.includes('column') || lower.includes('schema cache'))
}

export async function getPublishedServices() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching published services:', error)
      return { error: 'Failed to fetch services' }
    }

    return { data }
  } catch (error) {
    console.error('Error fetching published services:', error)
    return { error: 'Failed to fetch services' }
  }
}

export async function getServices() {
  try {
    const auth = await requireAdmin()
    if (auth.error || !auth.supabase) {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await auth.supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
      return { error: error.message || 'Failed to fetch services' }
    }

    return { data: data || [] }
  } catch (error) {
    console.error('Error in getServices:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch services' }
  }
}

export async function getService(id: string) {
  try {
    const auth = await requireAdmin()
    if (auth.error || !auth.supabase) {
      return { error: 'Unauthorized' }
    }

    const { data, error } = await auth.supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching service:', error)
      return { error: error.message || 'Failed to fetch service' }
    }

    return { data }
  } catch (error) {
    console.error('Error in getService:', error)
    return { error: error instanceof Error ? error.message : 'Failed to fetch service' }
  }
}

export async function createService(data: ServiceFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid service data' }
  }

  const validatedData = parsed.data
  const basePayload = {
    title: validatedData.title,
    description: validatedData.description,
    icon_name: validatedData.icon_name,
    status: validatedData.status,
    display_order: validatedData.display_order ?? 0,
  }

  let { error } = await auth.supabase
    .from('services')
    .insert([{ ...basePayload, ...(validatedData.link ? { link: validatedData.link } : {}) }])

  if (error && isMissingLinkColumnError(error.message)) {
    const retry = await auth.supabase.from('services').insert([basePayload])
    error = retry.error
  }

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateService(id: string, data: ServiceFormValues) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid service data' }
  }

  const validatedData = parsed.data
  const basePayload = {
    title: validatedData.title,
    description: validatedData.description,
    icon_name: validatedData.icon_name,
    status: validatedData.status,
    display_order: validatedData.display_order ?? 0,
    updated_at: new Date().toISOString(),
  }

  let { error } = await auth.supabase
    .from('services')
    .update({ ...basePayload, link: validatedData.link || null })
    .eq('id', id)

  if (error && isMissingLinkColumnError(error.message)) {
    const retry = await auth.supabase.from('services').update(basePayload).eq('id', id)
    error = retry.error
  }

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function deleteService(id: string) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { error } = await auth.supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

export async function updateServiceOrder(items: { id: string; display_order: number }[]) {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  for (const item of items) {
    const { error } = await auth.supabase
      .from('services')
      .update({ display_order: item.display_order })
      .eq('id', item.id)

    if (error) return { error: error.message || 'Failed to update order' }
  }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}

const defaultServicesList = [
  {
    title: 'Inbound Customer Support AI',
    description:
      'Deploy 24/7 voice agents that handle Tier-1 support, check order statuses via API, and intelligently route complex issues to human agents.',
    icon_name: 'Headphones',
    link: '/use-cases/customer-support',
    status: 'published',
    display_order: 0,
  },
  {
    title: 'Outbound Sales & Qualification',
    description:
      'High-volume AI dialers that call leads within 5 seconds of form submission, qualify them against your criteria, and book appointments.',
    icon_name: 'PhoneOutgoing',
    link: '/use-cases/sales',
    status: 'published',
    display_order: 1,
  },
  {
    title: 'Interactive Voice Response (IVR) 2.0',
    description:
      'Replace frustrating phone menus with conversational AI that understands natural language and solves problems instantly.',
    icon_name: 'MessageSquare',
    link: '/use-cases/ivr',
    status: 'published',
    display_order: 2,
  },
  {
    title: 'Automated Appointment Scheduling',
    description:
      'AI agents that call prospects, find a time that works for everyone, and book directly into your Google Calendar or Calendly.',
    icon_name: 'Calendar',
    link: '/use-cases/scheduling',
    status: 'published',
    display_order: 3,
  },
  {
    title: 'CRM & ERP Integrations',
    description:
      'Seamlessly connect AI voice agents to your existing CRM, ERP, or helpdesk systems for real-time data sync and workflow automation.',
    icon_name: 'Database',
    link: '/use-cases/crm-integration',
    status: 'published',
    display_order: 4,
  },
  {
    title: 'Multi-Language Support',
    description:
      'Communicate with your global audience effortlessly. Our agents fluidly switch between over 30 languages in real-time.',
    icon_name: 'Globe',
    link: '/use-cases/multi-language',
    status: 'published',
    display_order: 5,
  },
  {
    title: 'Custom AI Dashboards',
    description:
      'Get real-time visibility into your agent performance, view call transcripts, and analyze sentiment with custom analytics dashboards.',
    icon_name: 'BarChart',
    link: '/use-cases/custom-dashboards',
    status: 'published',
    display_order: 6,
  },
]

export async function seedDefaultServices() {
  const auth = await requireAdmin()
  if (auth.error || !auth.supabase) {
    return { error: 'Unauthorized' }
  }

  const { data: existingRows, error: fetchError } = await auth.supabase
    .from('services')
    .select('id')

  if (fetchError) {
    return { error: fetchError.message }
  }

  let { error: insertError } = await auth.supabase
    .from('services')
    .insert(defaultServicesList)

  if (insertError && isMissingLinkColumnError(insertError.message)) {
    const withoutLink = defaultServicesList.map(({ link: _link, ...rest }) => {
      void _link
      return rest
    })
    const retry = await auth.supabase.from('services').insert(withoutLink)
    insertError = retry.error
  }

  if (insertError) {
    return { error: insertError.message }
  }

  const oldIds = (existingRows || []).map((r) => r.id).filter(Boolean)
  if (oldIds.length > 0) {
    const { error: deleteError } = await auth.supabase
      .from('services')
      .delete()
      .in('id', oldIds)

    if (deleteError) {
      return { error: deleteError.message }
    }
  }

  revalidatePath('/admin/services')
  revalidatePath('/')
  return { success: true }
}
