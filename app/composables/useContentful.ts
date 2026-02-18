import type {
  ContentfulResponse,
  ContentfulAsset,
  MenuItem,
  HomePage,
  About
} from '~/types/contentful'

export function useContentful() {
  const config = useRuntimeConfig()

  const spaceId = config.public.contentfulSpaceId
  const environment = config.public.contentfulEnvironment
  const accessToken = config.public.contentfulAccessToken

  const baseUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}`

  // 基礎 fetch 方法
  async function fetchContentful<T>(
    contentType: string,
    params: Record<string, string> = {}
  ): Promise<ContentfulResponse<T>> {
    const query = new URLSearchParams({
      content_type: contentType,
      access_token: accessToken as string,
      ...params
    })

    const data = await $fetch<ContentfulResponse<T>>(
      `${baseUrl}/entries?${query.toString()}`
    )

    return data
  }

  // 解析圖片 URL（Contentful 回傳的 URL 沒有 https: 前綴）
  function resolveAssetUrl(asset: ContentfulAsset | undefined): string {
    if (!asset?.fields?.file?.url) return ''
    const url = asset.fields.file.url
    return url.startsWith('//') ? `https:${url}` : url
  }

  // 從 includes.Asset 找到對應的 Asset（linked entry 模式）
  function findAsset(
    assetId: string,
    includes?: ContentfulResponse<unknown>['includes']
  ): ContentfulAsset | undefined {
    return includes?.Asset?.find(a => a.sys.id === assetId)
  }

  // 取得所有菜單品項
  async function getMenuItems(params: Record<string, string> = {}) {
    return fetchContentful<MenuItem>('menuItem', params)
  }

  // 取得精選品項（featured = true）
  async function getFeaturedItems() {
    return fetchContentful<MenuItem>('menuItem', {
      'fields.featured': 'true'
    })
  }

  // 取得單一品項（by slug）
  async function getMenuItemBySlug(slug: string) {
    const data = await fetchContentful<MenuItem>('menuItem', {
      'fields.slug': slug,
      'limit': '1'
    })
    return data.items[0] ?? null
  }

  // 取得首頁資料
  async function getHomePage() {
    const data = await fetchContentful<HomePage>('homePage', { limit: '1' })
    return data.items[0] ?? null
  }

  // 取得關於我們
  async function getAbout() {
    const data = await fetchContentful<About>('about', { limit: '1' })
    return data.items[0] ?? null
  }

  return {
    fetchContentful,
    resolveAssetUrl,
    findAsset,
    getMenuItems,
    getFeaturedItems,
    getMenuItemBySlug,
    getHomePage,
    getAbout
  }
}
