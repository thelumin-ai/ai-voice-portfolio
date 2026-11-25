import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getBlogPost } from '../actions'
import { BlogForm } from '../BlogForm'

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: post, error } = await getBlogPost(resolvedParams.id)

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Post"
        description={`Updating "${post.title || 'Blog Post'}"`}
        backHref="/admin/blog"
        backLabel="Back to Blog"
      />

      <BlogForm initialData={post} />
    </div>
  )
}
