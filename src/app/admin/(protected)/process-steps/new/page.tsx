import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ProcessStepForm } from '../ProcessStepForm'

export default function NewProcessStepPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Process Step"
        description="Add a new stage to your agency implementation timeline."
        backHref="/admin/process-steps"
        backLabel="Back to Process Steps"
      />

      <ProcessStepForm />
    </div>
  )
}
