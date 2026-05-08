import { SeoForm } from '../SeoForm'

export default function NewSeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Route SEO</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure meta tags for a new website path.</p>
      </div>
      <SeoForm />
    </div>
  )
}
