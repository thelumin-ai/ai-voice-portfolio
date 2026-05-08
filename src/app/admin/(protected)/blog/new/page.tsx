import { BlogForm } from '../BlogForm'

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Write Post</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new blog post or case study.</p>
      </div>
      <BlogForm />
    </div>
  )
}
