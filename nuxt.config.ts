// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (server-side only)
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    // Public keys (exposed to client)
    public: {
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
      contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
