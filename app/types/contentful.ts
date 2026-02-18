import type { Document } from '@contentful/rich-text-types'

// Contentful 基礎型別

export interface ContentfulSys {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  locale: string
  contentType?: {
    sys: {
      id: string
    }
  }
}

// CDA 回傳的 Entry 中，關聯資源（Asset/Entry）是 Link 格式
// 真正的資料在 response.includes.Asset / includes.Entry 裡
export interface ContentfulLink {
  sys: {
    type: 'Link'
    linkType: 'Asset' | 'Entry'
    id: string
  }
}

export interface ContentfulAssetFile {
  url: string
  fileName: string
  contentType: string
  details: {
    size: number
    image?: {
      width: number
      height: number
    }
  }
}

export interface ContentfulAsset {
  sys: ContentfulSys
  fields: {
    title: string
    description?: string
    file: ContentfulAssetFile
  }
}

// Content Types

export interface MenuItem {
  sys: ContentfulSys
  fields: {
    name: string
    slug: string
    description: string
    price: number
    category: 'espresso' | 'drip' | 'tea' | 'dessert'
    image: ContentfulLink // CDA 回傳 Link，需透過 resolveAsset 取得實際圖片
    featured: boolean
  }
}

export interface HomePage {
  sys: ContentfulSys
  fields: {
    title: string
    subtitle: string
    heroImage: ContentfulLink // CDA 回傳 Link
    heroButtonText?: string
  }
}

export interface About {
  sys: ContentfulSys
  fields: {
    title: string
    description: Document // Rich Text
    coverImage?: ContentfulLink // CDA 回傳 Link
    address?: string
    openingHours?: string
  }
}

// Contentful API Response

export interface ContentfulResponse<T> {
  sys: { type: 'Array' }
  total: number
  skip: number
  limit: number
  items: T[]
  includes?: {
    Asset?: ContentfulAsset[]
    Entry?: unknown[]
  }
}
