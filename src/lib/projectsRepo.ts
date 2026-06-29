'use client'

export interface ProjectElement {
  id: string
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'divider' | 'slider' | 'accordion' | 'form' | string
  content: Record<string, any>
  styles?: Record<string, any>
  responsiveStyles?: Record<string, any>
}

export interface ProjectSection {
  id: string
  type: string
  title: string
  content: Record<string, any>
  isVisible: boolean
  styles?: Record<string, any>
  responsiveStyles?: Record<string, any>
  elements?: ProjectElement[]
}

export interface ProjectPage {
  id: string
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  layout: string[] // order of section IDs
  sections: Record<string, ProjectSection>
}

export interface Project {
  id: string
  name: string
  companyName: string
  businessCategory: string
  subdomain: string
  templateId: string
  logo?: string
  phone: string
  email: string
  address: string
  ctaText: string
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
  }
  status: 'Draft' | 'Published' | 'Unpublished'
  lastEdited: string
  pages: Record<string, ProjectPage>
  publishedPages?: Record<string, ProjectPage>
  themeColor?: string
  tagline?: string
}

export interface MediaItem {
  id: string
  url: string
  name: string
  alt: string
  size: string
  uploadedAt: string
}

// ─── Default Page Structures for Templates ──────────────────────────────────
const DEFAULT_PAGES_LIST = ['home', 'about', 'services', 'contact']

function getTemplateDefaultPages(templateId: string, companyName: string): Record<string, ProjectPage> {
  const isRoofing = templateId.includes('roofing-004')
  const isMfg = templateId.includes('manufacturing-003')
  const isAgency = templateId.includes('agency-002')
  
  // Default values
  const pages: Record<string, ProjectPage> = {}
  
  // Home Page
  pages['home'] = {
    id: 'home',
    slug: '',
    title: 'Home',
    seoTitle: `${companyName} | Home`,
    seoDescription: `Welcome to the home page of ${companyName}.`,
    layout: isRoofing 
      ? ['hero', 'bento', 'performance'] 
      : isMfg 
        ? ['hero', 'products', 'why', 'industries'] 
        : isAgency
          ? ['hero', 'services', 'traffic']
          : ['hero', 'services', 'about'],
    sections: {
      hero: {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        isVisible: true,
        content: isRoofing ? {
          heading: 'Durable Metal Roofs.\nPerfectly Installed.',
          subtext: 'Engineered for permanence. We deliver industrial-grade structural integrity for residential and commercial projects.',
          ctaText: 'Get Started',
          ctaSecondary: 'View Projects',
          bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600'
        } : {
          heading: `Welcome to ${companyName}`,
          subtext: 'We deliver outstanding quality and next-gen professional solutions.',
          ctaText: 'Get Started',
          bgImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1600'
        }
      },
      services: {
        id: 'services',
        type: 'services',
        title: 'Services Grid',
        isVisible: true,
        content: {
          heading: 'Our Core Solutions',
          subtext: 'Discover how we help our clients succeed with verified, certified services.',
          items: [
            { title: 'Premium Consulting', desc: 'Expert guidance tailored to your specific operations.' },
            { title: 'Quality Auditing', desc: 'Detailed inspections verifying conformity and safety.' },
            { title: 'Strategic Support', desc: '24/7 dedicated response for structural maintenance.' }
          ]
        }
      },
      bento: {
        id: 'bento',
        type: 'bento',
        title: 'Bento Grid',
        isVisible: true,
        content: {
          heading: 'Professional\nInstallation &\nServices',
          subtext: 'Unwavering precision in every detail. Clean structures, bold contrasts.',
          ctaText: 'Contact Us'
        }
      },
      performance: {
        id: 'performance',
        type: 'performance',
        title: 'Performance Cards',
        isVisible: true,
        content: {
          heading: 'Our Performance Metrics',
          cards: [
            { title: 'Global Delivery', desc: 'Expanding operations across all primary regional markets.' },
            { title: 'Zero Failure Rate', desc: '100% certified materials with rigorous check loops.' }
          ]
        }
      },
      about: {
        id: 'about',
        type: 'about',
        title: 'About Brief',
        isVisible: true,
        content: {
          heading: 'Who We Are',
          subtext: 'A legacy built on trust, engineering, and permanent excellence.',
          desc: 'For over two decades, we have supported builders, enterprises, and local projects with robust frameworks.'
        }
      }
    }
  }

  // About Page
  pages['about'] = {
    id: 'about',
    slug: 'about',
    title: 'About Us',
    seoTitle: `${companyName} | About Us`,
    seoDescription: `Learn more about our team, values, and history at ${companyName}.`,
    layout: ['banner', 'story', 'values'],
    sections: {
      banner: {
        id: 'banner',
        type: 'banner',
        title: 'Page Banner',
        isVisible: true,
        content: {
          label: 'About Our Team',
          heading: 'Built on Trust. Delivered with Precision.'
        }
      },
      story: {
        id: 'story',
        type: 'story',
        title: 'Our Story',
        isVisible: true,
        content: {
          heading: 'Decades of Industry Leadership',
          desc1: `${companyName} was founded with a single mission: to deliver exceptional results with zero compromises. Today, we handle residential, commercial, and enterprise infrastructure projects.`,
          desc2: 'Our team consists of certified specialists who undergo regular training and audit tests to maintain our high performance standards.'
        }
      },
      values: {
        id: 'values',
        type: 'values',
        title: 'Core Values',
        isVisible: true,
        content: {
          heading: 'Our Standards',
          items: [
            { title: 'Quality Craftsmanship', desc: 'We select only standard-grade materials designed for long-term endurance.' },
            { title: 'Integrity First', desc: 'Transparent budgeting, prompt timelines, and certified safety compliance.' },
            { title: 'Reliability Commit', desc: 'Continuous testing loops to prevent structural faults or project lags.' }
          ]
        }
      }
    }
  }

  // Services Page
  pages['services'] = {
    id: 'services',
    slug: 'services',
    title: 'Services',
    seoTitle: `${companyName} | Our Services`,
    seoDescription: `Explore the comprehensive catalog of professional services offered by ${companyName}.`,
    layout: ['banner', 'list', 'process'],
    sections: {
      banner: {
        id: 'banner',
        type: 'banner',
        title: 'Page Banner',
        isVisible: true,
        content: {
          label: 'Our Solutions',
          heading: 'Comprehensive Industrial Services'
        }
      },
      list: {
        id: 'list',
        type: 'list',
        title: 'Services List',
        isVisible: true,
        content: {
          items: [
            { icon: 'architecture', title: 'Design & Planning', desc: 'Blueprint-level calculations for building, drainage, and layout optimization.' },
            { icon: 'construction', title: 'Precision Installation', desc: 'Professional installation crews executing with millimetric precision.' },
            { icon: 'home_repair_service', title: 'Preventive Checks', desc: 'Regular inspections and repair patches to extend material longevity.' }
          ]
        }
      },
      process: {
        id: 'process',
        type: 'process',
        title: 'Process Timeline',
        isVisible: true,
        content: {
          heading: 'How We Work',
          steps: [
            { step: '01', title: 'Site Inspection', desc: 'Comprehensive mapping and sizing details checked onsite.' },
            { step: '02', title: 'Material Pick', desc: 'Procuring certified structural panels directly from manufacturers.' },
            { step: '03', title: 'Crew Launch', desc: 'Skilled deployment matching blueprint directions.' }
          ]
        }
      }
    }
  }

  // Contact Page
  pages['contact'] = {
    id: 'contact',
    slug: 'contact',
    title: 'Contact',
    seoTitle: `${companyName} | Contact Us`,
    seoDescription: `Reach out to our offices for inquiries, consultations, or requests at ${companyName}.`,
    layout: ['banner', 'details', 'form'],
    sections: {
      banner: {
        id: 'banner',
        type: 'banner',
        title: 'Page Banner',
        isVisible: true,
        content: {
          label: 'Get In Touch',
          heading: 'We Are Ready to Assist You'
        }
      },
      details: {
        id: 'details',
        type: 'details',
        title: 'Contact Information',
        isVisible: true,
        content: {
          phone: '+1 (800) 555-0199',
          email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          address: '100 Industrial Parkway, Suite 400, Houston, TX 77002',
          hours: 'Mon – Fri: 8:00 AM – 5:00 PM'
        }
      },
      form: {
        id: 'form',
        type: 'form',
        title: 'Message Form',
        isVisible: true,
        content: {
          heading: 'Send a Message',
          btnText: 'Submit Inquiry'
        }
      }
    }
  }

  return pages
}

// ─── Initial Mock Projects ──────────────────────────────────────────────────
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Ironclad Construction',
    companyName: 'IRONCLAD ROOFING',
    businessCategory: 'Roofing & Construction',
    subdomain: 'ironclad',
    templateId: 'legal_practice_roofing-004',
    status: 'Published',
    phone: '+1 (800) 476-6253',
    email: 'info@ironcladroofing.com',
    address: '4820 Industrial Blvd, Houston, TX 77001',
    ctaText: 'Get a Quote',
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    lastEdited: '2026-06-29T08:00:00.000Z',
    pages: getTemplateDefaultPages('legal_practice_roofing-004', 'IRONCLAD ROOFING')
  },
  {
    id: 'proj-2',
    name: 'Sarvam PVC Fittings',
    companyName: 'SARVAM PIPES',
    businessCategory: 'Manufacturing',
    subdomain: 'sarvampipes',
    templateId: 'business_consulting_manufacturing-003',
    status: 'Draft',
    phone: '+91-8979558231',
    email: 'sales@sarvampipes.com',
    address: 'MIDC Industrial Sector, Pune, India',
    ctaText: 'Request Quote',
    socialLinks: { github: 'https://github.com' },
    lastEdited: '2026-06-28T14:30:00.000Z',
    pages: getTemplateDefaultPages('business_consulting_manufacturing-003', 'SARVAM PIPES')
  }
]

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    name: 'roofing_worker.jpg',
    alt: 'Worker installing metal roof',
    size: '124 KB',
    uploadedAt: '2026-06-29T08:00:00.000Z'
  },
  {
    id: 'media-2',
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    name: 'mfg_floor.jpg',
    alt: 'Manufacturing pipeline floor',
    size: '185 KB',
    uploadedAt: '2026-06-29T08:00:00.000Z'
  },
  {
    id: 'media-3',
    url: 'https://images.unsplash.com/photo-1590644365607-0cf97a5e0bc8?auto=format&fit=crop&q=80&w=600',
    name: 'modern_house.jpg',
    alt: 'Sleek dark design house exterior',
    size: '98 KB',
    uploadedAt: '2026-06-29T08:00:00.000Z'
  }
]

// ─── Repository CRUD Operations ──────────────────────────────────────────────
export const projectsRepo = {
  // Load all projects
  getAll(): Project[] {
    if (typeof window === 'undefined') return INITIAL_PROJECTS
    const saved = localStorage.getItem('saas_projects')
    if (!saved) {
      localStorage.setItem('saas_projects', JSON.stringify(INITIAL_PROJECTS))
      return INITIAL_PROJECTS
    }
    return JSON.parse(saved)
  },

  // Get project by ID
  getById(id: string): Project | undefined {
    const list = this.getAll()
    return list.find(p => p.id === id)
  },

  // Save/Update project
  save(project: Project): void {
    if (typeof window === 'undefined') return
    const list = this.getAll()
    const idx = list.findIndex(p => p.id === project.id)
    
    project.lastEdited = new Date().toISOString()
    
    if (idx !== -1) {
      list[idx] = project
    } else {
      list.push(project)
    }
    localStorage.setItem('saas_projects', JSON.stringify(list))
    
    // Save separate page content copy for dynamic template loading
    localStorage.setItem(`project_content_${project.id}`, JSON.stringify(project))
  },

  // Create new project
  create(fields: Omit<Project, 'id' | 'pages' | 'lastEdited' | 'status'>): Project {
    const newProj: Project = {
      ...fields,
      id: `proj-${Date.now()}`,
      status: 'Draft',
      lastEdited: new Date().toISOString(),
      pages: getTemplateDefaultPages(fields.templateId, fields.companyName)
    }
    this.save(newProj)
    return newProj
  },

  // Duplicate a project
  duplicate(id: string): Project | undefined {
    const orig = this.getById(id)
    if (!orig) return undefined
    
    const clone: Project = {
      ...orig,
      id: `proj-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      companyName: `${orig.companyName} (Copy)`,
      subdomain: `${orig.subdomain}-copy-${Math.floor(Math.random() * 90 + 10)}`,
      status: 'Draft',
      lastEdited: new Date().toISOString()
    }
    this.save(clone)
    return clone
  },

  // Delete a project
  delete(id: string): void {
    if (typeof window === 'undefined') return
    const list = this.getAll()
    const filtered = list.filter(p => p.id !== id)
    localStorage.setItem('saas_projects', JSON.stringify(filtered))
    localStorage.removeItem(`project_content_${id}`)
  },

  // Rename a project
  rename(id: string, newName: string): Project | undefined {
    const proj = this.getById(id)
    if (!proj) return undefined
    proj.name = newName
    this.save(proj)
    return proj
  },

  // Change project publish status
  setStatus(id: string, status: 'Draft' | 'Published' | 'Unpublished'): Project | undefined {
    const proj = this.getById(id)
    if (!proj) return undefined
    proj.status = status
    this.save(proj)
    return proj
  },

  // Get Media Items
  getMedia(): MediaItem[] {
    if (typeof window === 'undefined') return INITIAL_MEDIA
    const saved = localStorage.getItem('saas_media')
    if (!saved) {
      localStorage.setItem('saas_media', JSON.stringify(INITIAL_MEDIA))
      return INITIAL_MEDIA
    }
    return JSON.parse(saved)
  },

  // Save Media Items
  saveMedia(media: MediaItem[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('saas_media', JSON.stringify(media))
  },

  // Upload image mock
  uploadMedia(name: string, url: string, alt: string): MediaItem {
    const items = this.getMedia()
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      url,
      name,
      alt: alt || name,
      size: 'Mock upload',
      uploadedAt: new Date().toISOString()
    }
    items.unshift(newItem)
    this.saveMedia(items)
    return newItem
  },

  // Delete Media
  deleteMedia(id: string): void {
    const items = this.getMedia()
    const filtered = items.filter(m => m.id !== id)
    this.saveMedia(filtered)
  }
}

// ─── React Hook for Template Content Synchronization ────────────────────────
import { useState, useEffect } from 'react'

export function useTemplateContent(templateId: string, defaultContent: any) {
  const [project, setProject] = useState<Project | null>(null)
  const [activePageId, setActivePageId] = useState<string>('home')
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const projectId = params.get('project_id')
    const mode = params.get('mode')

    // Determine activePageId based on route path
    const pathname = window.location.pathname
    let resolvedPageId = 'home'
    if (pathname.includes('/about')) resolvedPageId = 'about'
    else if (pathname.includes('/services')) resolvedPageId = 'services'
    else if (pathname.includes('/contact')) resolvedPageId = 'contact'
    else if (pathname.includes('/quote')) resolvedPageId = 'quote'
    
    setActivePageId(resolvedPageId)

    if (!projectId) return

    const loadContent = () => {
      const saved = localStorage.getItem(`project_content_${projectId}`)
      if (saved) {
        try {
          const proj: Project = JSON.parse(saved)
          setProject(proj)

          // Determine which pages structure to use (draft or published snapshot)
          const pagesToUse = (mode === 'published' && proj.publishedPages) ? proj.publishedPages : proj.pages
          
          // Build a reactive compiledContent object starting from defaultContent
          const compiledContent = JSON.parse(JSON.stringify(defaultContent))

          // Map global settings
          if (compiledContent.header) {
            compiledContent.header.logoText = proj.companyName || compiledContent.header.logoText
            compiledContent.header.phone = proj.phone || compiledContent.header.phone
            compiledContent.header.email = proj.email || compiledContent.header.email
            compiledContent.header.address = proj.address || compiledContent.header.address
            compiledContent.header.ctaText = proj.ctaText || compiledContent.header.ctaText
            compiledContent.header.quoteText = proj.ctaText || compiledContent.header.quoteText || 'Get a Quote'
            compiledContent.header.donateText = proj.ctaText || compiledContent.header.donateText || 'Donate Now'
          }

          if (compiledContent.footer) {
            compiledContent.footer.tagline = proj.tagline || compiledContent.footer.tagline || ''
            compiledContent.footer.copyright = `© ${new Date().getFullYear()} ${proj.companyName}. All Rights Reserved.`
          }

          // Map pages
          Object.keys(pagesToUse).forEach(pageId => {
            const page = pagesToUse[pageId]
            
            if (pageId === 'about' && compiledContent.about) {
              compiledContent.about.bannerHeading = page.sections.banner?.content?.heading || compiledContent.about.bannerHeading
              compiledContent.about.bannerSub = page.sections.banner?.content?.label || compiledContent.about.bannerSub
              compiledContent.about.storyHeading = page.sections.story?.content?.heading || compiledContent.about.storyHeading
              compiledContent.about.storyText = page.sections.story?.content?.desc1 || compiledContent.about.storyText
            }
            if (pageId === 'services' && compiledContent.services) {
              compiledContent.services.bannerHeading = page.sections.banner?.content?.heading || compiledContent.services.bannerHeading
              compiledContent.services.bannerSub = page.sections.banner?.content?.label || compiledContent.services.bannerSub
            }
            if (pageId === 'contact' && compiledContent.contact) {
              compiledContent.contact.bannerHeading = page.sections.banner?.content?.heading || compiledContent.contact.bannerHeading
              compiledContent.contact.bannerSub = page.sections.banner?.content?.label || compiledContent.contact.bannerSub
              compiledContent.contact.phone = page.sections.details?.content?.phone || compiledContent.contact.phone
              compiledContent.contact.email = page.sections.details?.content?.email || compiledContent.contact.email
              compiledContent.contact.address = page.sections.details?.content?.address || compiledContent.contact.address
            }

            if (pageId === 'home' && compiledContent.home) {
              const heroSec = page.sections.hero
              if (heroSec && heroSec.content) {
                compiledContent.home.heroHeading = heroSec.content.heading || compiledContent.home.heroHeading
                compiledContent.home.heroSubtext = heroSec.content.subtext || compiledContent.home.heroSubtext
                compiledContent.home.heroCta = heroSec.content.ctaText || compiledContent.home.heroCta
              }
              
              const bentoSec = page.sections.bento
              if (bentoSec && bentoSec.content) {
                compiledContent.home.bentoHeading = bentoSec.content.heading || compiledContent.home.bentoHeading
                compiledContent.home.bentoDesc = bentoSec.content.subtext || compiledContent.home.bentoDesc
                compiledContent.home.bentoCta = bentoSec.content.ctaText || compiledContent.home.bentoCta
              }
            }
          })

          setContent(compiledContent)
        } catch (e) {
          console.error('Failed to parse project content:', e)
        }
      }
    }

    loadContent()

    // Real-time postMessage listener
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'UPDATE_CONTENT' && e.data.project) {
        loadContent()
      }
    }
    
    // Element selection interceptor inside the iframe
    const handleDocumentClick = (e: MouseEvent) => {
      if (window.parent !== window) {
        const target = e.target as HTMLElement
        // Find closest heading, paragraph, button, image, link, list item, or section
        const editableEl = target.closest('h1, h2, h3, h4, h5, h6, p, a, button, img, li, section') as HTMLElement
        if (editableEl) {
          e.preventDefault()
          e.stopPropagation()
          
          // Clear previous outlines
          document.querySelectorAll('.active-outline').forEach(el => {
            el.classList.remove('active-outline')
            ;(el as HTMLElement).style.outline = ''
          })

          // Add active outline
          editableEl.classList.add('active-outline')
          editableEl.style.outline = '2px solid #3b82f6'
          editableEl.style.outlineOffset = '2px'

          const sectionEl = target.closest('section') || target.closest('[data-section-id]')
          const sectionId = sectionEl?.getAttribute('data-section-id') || sectionEl?.id || 'hero'
          
          // Determine element type/ID
          const tag = editableEl.tagName.toLowerCase()
          let elementId = editableEl.id || `${sectionId}-${tag}`
          
          window.parent.postMessage({
            type: 'ELEMENT_SELECTED',
            sectionId,
            elementId,
            elementType: tag
          }, '*')
        }
      }
    }

    // Double-click inline text editing bridge inside the iframe
    const handleDoubleClick = (e: MouseEvent) => {
      if (window.parent !== window) {
        const target = e.target as HTMLElement
        const editableEl = target.closest('h1, h2, h3, h4, h5, h6, p, a, button') as HTMLElement
        if (editableEl) {
          e.preventDefault()
          e.stopPropagation()
          
          // Make editable
          editableEl.contentEditable = 'true'
          editableEl.focus()
          
          // Selection highlight border for editing mode
          editableEl.style.outline = '2px dashed #10b981'
          editableEl.style.outlineOffset = '2px'
          
          const handleBlur = () => {
            editableEl.contentEditable = 'false'
            editableEl.style.outline = ''
            
            const sectionEl = target.closest('section') || target.closest('[data-section-id]')
            const sectionId = sectionEl?.getAttribute('data-section-id') || sectionEl?.id || 'hero'
            let elementId = editableEl.id || `${sectionId}-${editableEl.tagName.toLowerCase()}`
            const newText = editableEl.innerText || editableEl.textContent || ''
            
            window.parent.postMessage({
              type: 'INLINE_TEXT_UPDATED',
              sectionId,
              elementId,
              text: newText
            }, '*')
            
            editableEl.removeEventListener('blur', handleBlur)
          }
          
          editableEl.addEventListener('blur', handleBlur)
        }
      }
    }
    
    window.addEventListener('message', handleMessage)
    document.addEventListener('click', handleDocumentClick, true)
    document.addEventListener('dblclick', handleDoubleClick, true)
    
    return () => {
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('click', handleDocumentClick, true)
      document.removeEventListener('dblclick', handleDoubleClick, true)
    }
  }, [templateId, defaultContent])

  const resolvedMode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('mode') : null
  const activePage = project 
    ? ((resolvedMode === 'published' && project.publishedPages) ? project.publishedPages[activePageId] : project.pages[activePageId]) 
    : null

  return { content, project, activePage, activePageId }
}
