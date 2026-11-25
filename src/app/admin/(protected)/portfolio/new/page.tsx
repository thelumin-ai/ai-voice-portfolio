import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PortfolioForm } from '../PortfolioForm'

export default function NewPortfolioPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add New Project"
        description="Create a new portfolio project or voice AI case study."
        backHref="/admin/portfolio"
        backLabel="Back to Portfolio"
      />

      <PortfolioForm />
    </div>
  )
}
