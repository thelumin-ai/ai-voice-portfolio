import { MetadataRoute } from 'next'
import { getPublishedBlogPosts } from '@/app/admin/(protected)/blog/actions'
import { getPublishedUseCases } from '@/app/admin/(protected)/use-cases/actions'
import { mergePublishedUseCases } from '@/lib/useCasesData'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abimbola-ai-portfolio.vercel.app'

  const staticPaths: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/use-cases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  let blogPaths: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await getPublishedBlogPosts()
    if (posts && Array.isArray(posts)) {
      blogPaths = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.published_at || post.created_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error rendering dynamic sitemap blog posts:', error)
  }

  let useCasePaths: MetadataRoute.Sitemap = []
  try {
    const { data: useCases } = await getPublishedUseCases()
    const mergedUseCases = mergePublishedUseCases(
      Array.isArray(useCases) ? useCases : null
    )
    useCasePaths = mergedUseCases.map((uc) => ({
      url: `${baseUrl}/use-cases/${uc.industry_slug}`,
      lastModified: new Date(uc.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error rendering dynamic sitemap use cases:', error)
    useCasePaths = mergePublishedUseCases(null).map((uc) => ({
      url: `${baseUrl}/use-cases/${uc.industry_slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  }

  return [...staticPaths, ...blogPaths, ...useCasePaths]
}
