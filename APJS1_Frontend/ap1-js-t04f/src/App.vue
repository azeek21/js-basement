<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import Header from './components/header/Header.vue'
import { computed, effect, onMounted, watch, watchEffect } from 'vue'
import { useAuthStore } from './stores/auth'
import { Toaster } from './components/ui/sonner'
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

watch(
  auth,
  () => {
    if (!auth.user || !auth.isAuthenticated) {
      router.push('/sign-in')
    }
  },
  { immediate: true },
)

// onMounted(() => {
//   auth.signIn()
// })

const OPEN_ROUTES = ['signin', 'signup']
const isOpenRoute = computed(() =>
  route.matched.some((l) => OPEN_ROUTES.includes(l.name as string)),
)
</script>

<template>
  <Header />
  <RouterView v-if="auth.isAuthenticated || isOpenRoute" />
  <Toaster />
</template>
