import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { BlogForm } from '../BlogForm'

export default function NewBlogPostPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Write Post"
        description="Create a new blog article or insights guide."
        backHref="/admin/blog"
        backLabel="Back to Blog"
      />

      <BlogForm />
    </div>
  )
}
