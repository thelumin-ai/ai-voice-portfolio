import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { UseCaseForm } from '../UseCaseForm'
import { getUseCase } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditUseCasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: usecase, error } = await getUseCase(resolvedParams.id)

  if (error || !usecase) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Use Case"
        description={`Updating "${usecase.name || 'Use Case'}"`}
        backHref="/admin/use-cases"
        backLabel="Back to Use Cases"
      />

      <UseCaseForm initialData={usecase} />
    </div>
  )
}
