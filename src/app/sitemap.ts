import { MetadataRoute } from 'next'
import { getPublishedBlogPosts } from '@/app/admin/(protected)/blog/actions'
import { getUseCases } from '@/app/admin/(protected)/use-cases/actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abimbola-ai-portfolio.vercel.app'
  
  // Static pages
  const staticPaths = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/use-cases`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ]
  
  // Fetch dynamic blog posts
  let blogPaths: any[] = []
  try {
    const { data: posts } = await getPublishedBlogPosts()
    if (posts && Array.isArray(posts)) {
      blogPaths = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error rendering dynamic sitemap blog posts:', error)
  }
  
  // Fetch dynamic use cases
  let useCasePaths: any[] = []
  try {
    const { data: useCases } = await getUseCases()
    if (useCases && Array.isArray(useCases)) {
      useCasePaths = useCases.map(uc => ({
        url: `${baseUrl}/use-cases/${uc.industry_slug}`,
        lastModified: new Date(uc.updated_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error rendering dynamic sitemap use cases:', error)
  }
  
  return [...staticPaths, ...blogPaths, ...useCasePaths]
}
