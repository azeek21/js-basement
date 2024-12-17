<script setup lang="ts">
import { fetchMockGameSession, fetchMyGame, GAME_SERVICE_SLUG } from '@/lib/services/game'
import { useQuery } from '@tanstack/vue-query'
import { Skeleton } from '../ui/skeleton'
import GameBoard from './GameBoard.vue'
import { GameState } from '@/lib/types/game'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const {
  isLoading: isGameSessionLoading,
  data: gameSession,
  isError,
  error,
} = useQuery({
  queryKey: [GAME_SERVICE_SLUG, 'my-game'],
  queryFn: fetchMockGameSession,
})

const hasNoGame = computed(() => !isGameSessionLoading && !isError && !gameSession)
</script>

<template>
  <div class="m-auto flex flex-col gap-4 max-w-screen-sm">
    <Skeleton class="w-full aspect-square" v-if="isGameSessionLoading" />
    <div
      class="border rounded-lg flex gap-2 items-center justify-evenly"
      v-if="gameSession && gameSession.state !== GameState.INIT"
    >
      <p>{{ gameSession.playerX.name }}: <span class="text-2xl text-red-500">o</span></p>
      <p>{{ gameSession.playerO.name }}: <span class="text-2xl text-red-500">o</span></p>
      <p>It's {{ auth.user?.id === gameSession.turnOfUser.id ? 'your' : "opponent's" }} turn</p>
    </div>
    <GameBoard
      v-if="gameSession && gameSession.id && gameSession.state !== GameState.INIT"
      :map="gameSession.map"
      :onClick="(cords) => console.log('cords: ', cords)"
    />

    <Button v-if="gameSession && gameSession.state !== GameState.INIT" variant="destructive"
      >Give Up</Button
    >
    <p v-if="hasNoGame">Yuo don't an active game. Create one now!</p>
    <Button v-if="hasNoGame">Create game</Button>
    <Button v-if="hasNoGame">Invite Player</Button>

    <p v-if="isError" class="text-red-500">Something went terrible wrong: {{ String(error) }}</p>
  </div>
</template>
