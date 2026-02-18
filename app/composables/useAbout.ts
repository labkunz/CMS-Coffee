import type { About } from '~/types/contentful'

export function useAbout() {
  const { fetchContentful } = useContentfulClient()

  // 取得關於我們
  async function getAbout() {
    return fetchContentful<About>('about', { limit: '1' })
  }

  return {
    getAbout
  }
}
