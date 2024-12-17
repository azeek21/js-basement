<script setup lang="ts">
import { fetchMockActiveGames } from '@/lib/services/game'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Loader } from '@/components/ui/loader'
import { sleep } from '@/lib/services/base'
import { useRouter } from 'vue-router'

const ACTIVE_GAMES_SLUG = 'games-history'
const { data, isLoading, isError, error } = useQuery({
  queryKey: [ACTIVE_GAMES_SLUG],
  queryFn: fetchMockActiveGames,
})
</script>

<template>
  <main class="flex flex-row p-4 gap-8 w-full">
    <div class="m-auto max-w-screen-sm flex flex-col gap-4">
      <h1>History <Loader v-if="isLoading" /></h1>

      <p v-if="isError">{{ String(error) }}</p>
      <ul v-if="data" class="flex flex-col gap-2">
        <div
          v-for="game in data"
          :key="game.id"
          class="border rounded-lg p-2 hover:shadow-lg transition-shadow hover:border-accent-foreground"
        >
          <p class="text-ellipsis overflow-hidden whitespace-nowrap">ID: {{ game.id }}</p>
          <p>Creator: {{ game.creator.name }}</p>
          <p>Winner: {{ game?.winner?.name }}</p>
          <p>Player X: {{ game?.playerX?.name }}</p>
          <p>Player O: {{ game?.playerO?.name }}</p>
        </div>
      </ul>
    </div>
  </main>
</template>
