import { getBlogPost } from '../actions'
import { BlogForm } from '../BlogForm'
import { notFound } from 'next/navigation'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const { data: post, error } = await getBlogPost(params.id)

  if (error || !post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update your blog article.</p>
      </div>
      <BlogForm initialData={post} />
    </div>
  )
}
