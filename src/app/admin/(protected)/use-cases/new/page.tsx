import { UseCaseForm } from '../UseCaseForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewUseCasePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/use-cases" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Use Cases
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Use Case</h1>
        <p className="text-gray-500 dark:text-gray-400">Create a new industry use case page.</p>
      </div>

      <UseCaseForm />
    </div>
  )
}
