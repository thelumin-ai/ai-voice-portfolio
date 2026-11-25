import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TechStackForm } from '../TechStackForm'

export default function NewTechStackPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Tool"
        description="Add a new technology, API, or voice engine to your stack."
        backHref="/admin/tech-stack"
        backLabel="Back to Tech Stack"
      />

      <TechStackForm />
    </div>
  )
}
