import { getBlogPosts } from "@/app/admin/(protected)/blog/actions"
import Link from "next/link"
import { Calendar, ChevronRight, User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Revalidate every hour
export const revalidate = 3600

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { data: posts } = await getBlogPosts()
    const post = posts?.find(p => p.slug === params.slug)
    
    if (!post) return { title: 'Post Not Found' }

    return {
        title: `${post.title} | AI Voice Agency`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.cover_image_url ? [post.cover_image_url] : [],
        }
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { data: posts } = await getBlogPosts()
    const post = posts?.find(p => p.slug === params.slug && p.status === 'published')

    if (!post) {
        notFound()
    }

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pt-24 pb-24 font-sans transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                
                <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <article>
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 leading-tight transition-colors duration-300">
                            {post.title}
                        </h1>
                        
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.author}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {format(new Date(post.created_at || Date.now()), 'MMMM d, yyyy')}
                            </div>
                        </div>
                    </header>

                    {post.cover_image_url && (
                        <div className="w-full h-auto rounded-2xl overflow-hidden mb-12 shadow-lg">
                            <img 
                                src={post.cover_image_url} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 transition-colors">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>
                
            </div>
        </div>
    )
}
