import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getAdminSeoSettings } from './actions'
import { SeoList } from './SeoList'

export const dynamic = 'force-dynamic'

export default async function SeoAdminPage() {
  const { data: settings, error } = await getAdminSeoSettings()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO & Meta Editor"
        description="Configure search titles, meta descriptions, keywords, and OpenGraph images per route."
        actions={
          <Button asChild>
            <Link href="/admin/seo/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Route SEO
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load SEO settings" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SeoList initialSettings={settings || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
