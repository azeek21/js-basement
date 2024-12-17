<script setup lang="ts">
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader/loader.vue'
import { sleep } from '@/lib/services/base'
import { createGame } from '@/lib/services/game'
import { fetchMockOnlineUsers, USERS_SERVICE_SLUG } from '@/lib/services/user'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ExternalLink } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()

const {
  isLoading,
  data,
  isError: isOnlinePlayersError,
  error: onlinePlayersError,
} = useQuery({
  queryKey: [USERS_SERVICE_SLUG, 'online'],
  queryFn: fetchMockOnlineUsers,
})

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: createGame,
  mutationKey: ['create-game-vs-pc'],
  onSuccess: () => {
    router.push('/current-game')
  },
})

const {
  mutate: againstPlayer,
  isPending: againstPlayerPending,
  isError: isAgainstPlayerError,
  error: againstPlayerError,
} = useMutation({
  mutationFn: async (player: string) => {
    await sleep(4000)
    return createGame()
  },
  mutationKey: ['create-game-vs-player'],
  onSuccess: () => {
    router.push('/current-game')
  },
})
</script>

<template>
  <main class="flex flex-row p-4 gap-8 w-full">
    <div class="m-auto flex flex-col gap-4">
      <h1 class="text-4xl flex items-center">New Game <Loader v-if="isPending" /></h1>
      <p v-if="isError">{{ String(error) }}</p>
      <Button :disabled="isPending || againstPlayerPending" :onclick="mutate">Against PC</Button>
      <h2 class="text-3xl flex items-center">
        Or chose an opponent <Loader v-if="isLoading || againstPlayerPending" />
      </h2>
      <p v-if="isAgainstPlayerError">{{ String(againstPlayerError) }}</p>
      <p v-if="isOnlinePlayersError">{{ String(onlinePlayersError) }}</p>
      <ul v-if="data" class="flex flex-col gap-2 w-full">
        <li class="flex flex-col" v-for="player in data" :key="player.id">
          <Button
            :disabled="isPending || againstPlayerPending"
            :onclick="() => againstPlayer(player.id)"
            >{{ player.name }} <ExternalLink
          /></Button>
        </li>
      </ul>
    </div>
  </main>
</template>
