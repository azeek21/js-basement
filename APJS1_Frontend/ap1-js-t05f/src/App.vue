<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import Header from './components/header/Header.vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { Toaster } from './components/ui/sonner'
import { monkeyThrow } from './lib/utils'
import { mockSignIn, type SingInOptions } from './lib/services/auth'
import { toast } from 'vue-sonner'
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const refreshTimeoutId = ref<ReturnType<typeof setTimeout>>(0)

watch(
  auth,
  () => {
    if (!auth.user || !auth.isAuthenticated) {
      router.push('/sign-in')
    }
  },
  { immediate: true },
)

watch(auth, () => {
  clearTimeout(refreshTimeoutId.value)
  const refershInMs = new Date(auth.expires).getTime() - Date.now() - 10000
  console.log('refreshes in (MS): ', refershInMs)
  refreshTimeoutId.value = setTimeout(() => {
    console.log('refreshing tokens...')
    const thworingRefresher = monkeyThrow(
      () => mockSignIn({} as SingInOptions),
      'Error refreshing auth tokens :(((((',
    )

    try {
      thworingRefresher().then((tokens) => {
        console.log('refresh success tokens: ', tokens)
        auth.token = tokens.token
        auth.refreshToken = tokens.refreshToken
        auth.expires = tokens.expires
      })
    } catch (error) {
      toast(String(error))
      router.push('/sign-in')
    }
  }, refershInMs)
})

onUnmounted(() => {
  clearTimeout(refreshTimeoutId.value)
})

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
