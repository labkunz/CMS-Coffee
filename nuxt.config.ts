// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Public keys (exposed to client)
    public: {
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
      contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  image: {
    domains: ['images.ctfassets.net']
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
