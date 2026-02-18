import type { ContentfulAsset, ContentfulResponse } from '~/types/contentful'

// 解析圖片 URL（Contentful 回傳的 URL 沒有 https: 前綴）
export function resolveAssetUrl(asset: ContentfulAsset | undefined): string {
  if (!asset?.fields?.file?.url) return ''
  const url = asset.fields.file.url
  return url.startsWith('//') ? `https:${url}` : url
}

// 從 includes.Asset 找到對應的 Asset（linked entry 模式）
export function findAsset(
  assetId: string,
  includes?: ContentfulResponse<unknown>['includes']
): ContentfulAsset | undefined {
  return includes?.Asset?.find(a => a.sys.id === assetId)
}
