import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ServiceForm } from '../ServiceForm'

export default function NewServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Service"
        description="Create a new service card for the public homepage."
        backHref="/admin/services"
        backLabel="Back to Services"
      />

      <ServiceForm />
    </div>
  )
}
