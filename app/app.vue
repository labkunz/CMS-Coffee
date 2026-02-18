<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'zh-TW'
  }
})

useSeoMeta({
  title: 'Brew & Bean · 咖啡廳',
  description: '精選豆源、手沖咖啡、甜點，歡迎來到 Brew & Bean。',
  ogTitle: 'Brew & Bean · 咖啡廳',
  ogDescription: '精選豆源、手沖咖啡、甜點，歡迎來到 Brew & Bean。',
  twitterCard: 'summary_large_image'
})

const navLinks = [
  { label: '首頁', to: '/' },
  { label: '菜單', to: '/menu' },
  { label: '關於我們', to: '/about' }
]
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="text-xl font-bold tracking-tight text-primary"
        >
          Brew &amp; Bean
        </NuxtLink>
      </template>

      <template #body>
        <UNavigationMenu
          :items="navLinks"
          orientation="horizontal"
          class="hidden md:flex"
        />
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Brew &amp; Bean · 用心沖出每一杯
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
