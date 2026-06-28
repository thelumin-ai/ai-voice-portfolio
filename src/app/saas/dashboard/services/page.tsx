import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ServicesForm } from './ServicesForm'

export default async function SaasServicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/saas/login')
  }

  // Fetch services for this tenant
  const { data: services, error } = await supabase
    .from('saas_services')
    .select('id, title, description, icon')
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500">
        <h3 className="font-bold">Services Load Error</h3>
        <p className="text-sm mt-1">Could not fetch your services. Please verify your connection status.</p>
      </div>
    )
  }

  // Ensure type safety
  const formattedServices = (services || []).map(s => ({
    id: s.id,
    title: s.title || '',
    description: s.description || '',
    icon: s.icon || 'Phone'
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">Services &amp; Solutions</h1>
        <p className="text-sm text-zinc-500 mt-1">Add, edit, or remove custom solutions to showcase on your landing page.</p>
      </div>

      <ServicesForm initialServices={formattedServices} />
    </div>
  )
}
