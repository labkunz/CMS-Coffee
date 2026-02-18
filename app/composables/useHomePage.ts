import type { HomePage } from '~/types/contentful'

export function useHomePage() {
  const { fetchContentful } = useContentfulClient()

  // 取得首頁資料
  async function getHomePage() {
    return fetchContentful<HomePage>('homePage', { limit: '1' })
  }

  return {
    getHomePage
  }
}
