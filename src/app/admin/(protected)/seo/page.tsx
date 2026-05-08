import { getSeoSettings } from './actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SeoList } from './SeoList'

export default async function SeoAdminPage() {
  const { data: settings } = await getSeoSettings()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO & Meta Editor</h1>
        <Button asChild>
          <Link href="/admin/seo/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Route SEO
          </Link>
        </Button>
      </div>

      <SeoList initialSettings={settings || []} />
    </div>
  )
}
