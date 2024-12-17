<script setup lang="ts">
import { fetchMockActiveGames } from '@/lib/services/game'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Loader } from '@/components/ui/loader'
import { sleep } from '@/lib/services/base'
import { useRouter } from 'vue-router'
import { mockFetchLeaderabord } from '@/lib/services/user'
import { getRateOf } from '@/lib/utils'

const ACTIVE_GAMES_SLUG = 'games-history'
const { data, isLoading, isError, error } = useQuery({
  queryKey: [ACTIVE_GAMES_SLUG],
  queryFn: mockFetchLeaderabord,
})
</script>

<template>
  <main class="flex flex-row p-4 gap-8 w-full">
    <div class="m-auto max-w-screen-sm flex flex-col gap-4">
      <h1>History <Loader v-if="isLoading" /></h1>
      <p v-if="isError">{{ String(error) }}</p>

      <ul v-if="data" class="flex flex-col gap-2">
        <div
          v-for="player in data"
          :key="player.id"
          class="border rounded-lg p-2 hover:shadow-lg transition-shadow hover:border-accent-foreground"
        >
          <p class="text-ellipsis overflow-hidden whitespace-nowrap">ID: {{ player.id }}</p>
          <p>Name: {{ player.name }}</p>
          <p>Wins: {{ player.cWins }}</p>
          <p>Games: {{ player.cGames }}</p>
          <p>Rate: {{ getRateOf(player.cGames, player.cWins) }}%</p>
        </div>
      </ul>
    </div>
  </main>
</template>
