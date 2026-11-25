import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getProcessStep } from '../actions'
import { ProcessStepForm } from '../ProcessStepForm'

export const dynamic = 'force-dynamic'

export default async function EditProcessStepPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: step, error } = await getProcessStep(resolvedParams.id)

  if (error || !step) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Process Step"
        description={`Updating "${step.title || 'Process Step'}"`}
        backHref="/admin/process-steps"
        backLabel="Back to Process Steps"
      />

      <ProcessStepForm initialData={step} />
    </div>
  )
}
