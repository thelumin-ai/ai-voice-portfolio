import { PortfolioForm } from '../PortfolioForm'

export default function NewPortfolioPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Project</h1>
        <p className="text-sm text-gray-500">Create a new portfolio case study.</p>
      </div>

      <PortfolioForm />
    </div>
  )
}
