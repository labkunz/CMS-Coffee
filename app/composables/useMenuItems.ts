import type { MenuItem } from '~/types/contentful'

export function useMenuItems() {
  const { fetchContentful } = useContentfulClient()

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
    return fetchContentful<MenuItem>('menuItem', {
      'fields.slug': slug,
      'limit': '1'
    })
  }

  return {
    getMenuItems,
    getFeaturedItems,
    getMenuItemBySlug
  }
}
