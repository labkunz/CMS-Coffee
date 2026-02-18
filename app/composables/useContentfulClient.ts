import type { ContentfulResponse } from '~/types/contentful'

export function useContentfulClient() {
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

    try {
      const data = await $fetch<ContentfulResponse<T>>(
        `${baseUrl}/entries?${query.toString()}`
      )
      return data
    } catch (error: unknown) {
      // HTTP 錯誤（FetchError 帶有 statusCode）
      if (typeof error === 'object' && error !== null && 'statusCode' in error) {
        const fetchError = error as { statusCode: number, message?: string }
        throw createError({
          statusCode: fetchError.statusCode,
          statusMessage: getErrorMessage(fetchError.statusCode)
        })
      }

      // 網路錯誤（無 statusCode，例如斷線、timeout）
      throw createError({
        statusCode: 503,
        statusMessage: '網路連線異常，請確認網路後重試'
      })
    }
  }

  return {
    fetchContentful
  }
}

function getErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: '請求格式錯誤',
    401: 'API 認證失敗，請確認 Access Token',
    404: '找不到指定的資源',
    429: '請求頻率過高，請稍後再試',
    500: 'Contentful 伺服器錯誤',
    503: 'Contentful 服務暫時不可用'
  }
  return messages[statusCode] ?? `未知錯誤（${statusCode}）`
}
