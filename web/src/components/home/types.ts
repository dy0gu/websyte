export type HomeProject = {
  id: number
  title: string
  summary: string
  typeLabel: string
  publishedAt?: string | null
  technologies: string[]
  projectURL?: string | null
  sourceURL?: string | null
  visualStyle: 'violet' | 'coral' | 'silver'
  cover?: {
    url: string
    alt: string
    width?: number
    height?: number
  } | null
}

export type HomePost = {
  id: number
  title: string
  slug: string
  description?: string | null
  publishedAt?: string | null
}
