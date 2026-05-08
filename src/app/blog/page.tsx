import { getBlogPosts } from "@/app/admin/(protected)/blog/actions"
import Link from "next/link"
import { Calendar, ChevronRight, User } from "lucide-react"
import { format } from "date-fns"

import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";

export async function generateMetadata() {
  const { data: settings } = await getSeoSettings();
  const seo = settings?.find((s: any) => s.page_path === '/blog');
  
  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.title,
        description: seo.description,
        images: seo.og_image_url ? [seo.og_image_url] : [],
      }
    };
  }
  
  return {
    title: "Blog & Insights | AI Voice Agency",
    description: "Read the latest insights and case studies on AI Voice automation.",
  };
}

export default async function BlogIndexPage() {
    const { data: posts } = await getBlogPosts()
    const publishedPosts = posts?.filter(p => p.status === 'published') || []

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pt-24 pb-16 font-sans transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-300">
                    <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-1 rounded transition-colors duration-300">Blog</span>
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 transition-colors duration-300">
                        Insights & <span className="text-blue-600 dark:text-blue-500 text-gradient">Case Studies</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Thoughts, learnings, and deep dives into AI voice automation.
                    </p>
                </div>

                {publishedPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl">
                        <p className="text-gray-500 dark:text-gray-400">No published posts yet. Check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {publishedPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                                {post.cover_image_url ? (
                                    <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                        <img 
                                            src={post.cover_image_url} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                        <span className="text-blue-500/40 text-4xl font-bold">AI</span>
                                    </div>
                                )}
                                
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            {post.author}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {format(new Date(post.created_at || Date.now()), 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
