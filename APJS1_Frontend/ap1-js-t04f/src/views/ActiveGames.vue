<script setup lang="ts">
import { fetchMockActiveGames } from '@/lib/services/game'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Loader } from '@/components/ui/loader'
import { sleep } from '@/lib/services/base'
import { useRouter } from 'vue-router'

const ACTIVE_GAMES_SLUG = 'active-games'
const router = useRouter()
const { data, isLoading, isError, error } = useQuery({
  queryKey: [ACTIVE_GAMES_SLUG],
  queryFn: fetchMockActiveGames,
})

const { mutate, isPending } = useMutation({
  mutationKey: ['join-game'],
  mutationFn: async () => {
    await sleep(2000)
  },
  onSuccess: () => {
    router.push('/current-game')
  },
})
</script>

<template>
  <main class="flex flex-row p-4 gap-8 w-full">
    <div class="m-auto max-w-screen-sm flex flex-col gap-4">
      <h1>
        Select a game from list to join or
        <RouterLink class="text-teal-400 underline" to="/new-game">Create a new one</RouterLink>
      </h1>

      <ul v-if="data" class="flex flex-col gap-2">
        <div
          v-for="game in data"
          :key="game.id"
          class="border rounded-lg p-2 hover:shadow-lg transition-shadow hover:border-accent-foreground"
          :onclick="mutate"
        >
          <p class="text-ellipsis overflow-hidden whitespace-nowrap">ID: {{ game.id }}</p>
          <p>Creator: {{ game.creator.name }}</p>
        </div>
      </ul>
    </div>
    <Loader v-if="isLoading || isPending" />
  </main>
</template>
