import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ServiceForm } from '../ServiceForm'
import { getService } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: service, error } = await getService(resolvedParams.id)

  if (error || !service) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Service"
        description={`Updating "${service.title || 'Service'}"`}
        backHref="/admin/services"
        backLabel="Back to Services"
      />

      <ServiceForm initialData={service} />
    </div>
  )
}
