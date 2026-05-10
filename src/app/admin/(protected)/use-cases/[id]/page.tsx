import { UseCaseForm } from '../UseCaseForm'
import { getUseCase } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditUseCasePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: usecase, error } = await getUseCase(resolvedParams.id)

  if (error || !usecase) {
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/use-cases" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Use Cases
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Use Case</h1>
        <p className="text-gray-500 dark:text-gray-400">Update the industry use case details.</p>
      </div>

      <UseCaseForm initialData={usecase} />
    </div>
  )
}
