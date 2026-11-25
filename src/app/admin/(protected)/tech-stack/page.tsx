import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getTechStack } from './actions'
import { SortableList } from './SortableList'

export const dynamic = 'force-dynamic'

export default async function TechStackAdminPage() {
  const { data: techStack, error } = await getTechStack()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tech Stack"
        description="Manage the tools, voice platforms, and AI frameworks displayed on your site."
        actions={
          <Button asChild>
            <Link href="/admin/tech-stack/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Tool
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load tech stack" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SortableList initialItems={techStack || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
