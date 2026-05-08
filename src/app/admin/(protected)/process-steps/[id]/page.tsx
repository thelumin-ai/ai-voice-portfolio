import { getProcessStep } from '../actions'
import { ProcessStepForm } from '../ProcessStepForm'
import { notFound } from 'next/navigation'

export default async function EditProcessStepPage({ params }: { params: { id: string } }) {
  const { data: step, error } = await getProcessStep(params.id)

  if (error || !step) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Step</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update process step details.</p>
      </div>
      <ProcessStepForm initialData={step} />
    </div>
  )
}
