import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { UseCaseForm } from '../UseCaseForm'

export default function NewUseCasePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Use Case"
        description="Create a new industry-specific landing page and workflow breakdown."
        backHref="/admin/use-cases"
        backLabel="Back to Use Cases"
      />

      <UseCaseForm />
    </div>
  )
}
