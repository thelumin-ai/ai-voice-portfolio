import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PlaygroundForm } from '../PlaygroundForm'

export default function NewPlaygroundPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Playground App"
        description="Add a new interactive AI voice or automation demo."
        backHref="/admin/playground"
        backLabel="Back to Playground"
      />

      <PlaygroundForm />
    </div>
  )
}
