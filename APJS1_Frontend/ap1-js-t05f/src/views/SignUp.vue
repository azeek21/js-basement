<script setup lang="ts">
import SignUp from '@/components/auth/SignUp.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <main class="flex flex-col p-4">
    <SignUp />
  </main>
</template>
