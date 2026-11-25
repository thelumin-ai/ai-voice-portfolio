import { getBlogPostBySlug } from "@/app/admin/(protected)/blog/actions"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { serializeJsonLd } from "@/lib/seo/jsonLd"

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { data: post } = await getBlogPostBySlug(resolvedParams.slug)

    if (!post) return { title: 'Post Not Found' }

    return {
        title: `${post.title} | AI Voice Agency`,
        description: post.excerpt,
        alternates: { canonical: `/blog/${resolvedParams.slug}` },
        ...(post.cover_image_url
            ? {
                  openGraph: {
                      title: post.title,
                      description: post.excerpt,
                      images: [post.cover_image_url],
                  },
              }
            : {}),
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params
    const { data: post } = await getBlogPostBySlug(resolvedParams.slug)

    if (!post) {
        notFound()
    }

    const dateStr = post.published_at || post.created_at;
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://abimbola-ai-portfolio.vercel.app').replace(/\/+$/, '');
    const postUrl = `${siteUrl}/blog/${resolvedParams.slug}`;
    const blogStructuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt || '',
                url: postUrl,
                ...(dateStr ? { datePublished: dateStr } : {}),
                ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
                author: {
                    '@type': 'Person',
                    name: post.author || 'Abimbola Akinsanmi',
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
                    { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
                ],
            },
        ],
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pt-16 pb-24 font-sans transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogStructuredData) }}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

                <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <article>
                    <header className="mb-10 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 leading-tight transition-colors duration-300">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.author}
                            </div>
                            {dateStr && (
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {format(new Date(dateStr), 'MMMM d, yyyy')}
                                </div>
                            )}
                        </div>
                    </header>

                    {post.cover_image_url && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-lg bg-gray-100 dark:bg-zinc-900">
                            <Image
                                src={post.cover_image_url}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-pre:overflow-x-auto transition-colors">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                table: (props) => (
                                    <div className="overflow-x-auto my-6">
                                        <table {...props} />
                                    </div>
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>

            </div>
        </div>
    )
}
