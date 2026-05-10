import { ServiceForm } from '../ServiceForm'
import { getService } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: service, error } = await getService(resolvedParams.id)

  if (error || !service) {
    notFound()
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin/services" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Update the service details.</p>
      </div>

      <ServiceForm initialData={service} />
    </div>
  )
}
