import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getBlogPosts } from './actions'
import { BlogList } from './BlogList'

export const dynamic = 'force-dynamic'

export default async function BlogAdminPage() {
  const { data: posts, error } = await getBlogPosts()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog & Insights"
        description="Manage your published articles, drafts, and AI-assisted posts."
        actions={
          <Button asChild>
            <Link href="/admin/blog/new">
              <PenSquare className="w-4 h-4 mr-2" />
              Write Post
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load blog posts" message={error} />}

      <BlogList initialPosts={posts || []} hasFetchError={Boolean(error)} />
    </div>
  )
}
