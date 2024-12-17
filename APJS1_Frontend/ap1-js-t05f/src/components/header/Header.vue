<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const route = useRoute()
const auth = useAuthStore()
const isActiveRoute = (name: string) => {
  return route.matched.some((l) => l.name === name)
}
</script>

<template>
  <header class="px-4 py-2 border-b flex items-center justify-between">
    <NavigationMenu v-if="auth.isAuthenticated">
      <NavigationMenuList class="gap-4">
        <NavigationMenuItem>
          <RouterLink to="/active-games">
            <NavigationMenuLink
              :class="isActiveRoute('active-games') && 'font-extrabold text-teal-400'"
            >
              Join A Game
            </NavigationMenuLink>
          </RouterLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <RouterLink to="/new-game">
            <NavigationMenuLink
              :class="isActiveRoute('new-game') && 'font-extrabold text-teal-400'"
            >
              New Game
            </NavigationMenuLink>
          </RouterLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <RouterLink to="/current-game">
            <NavigationMenuLink
              :class="isActiveRoute('current-game') && 'font-extrabold text-teal-400'"
            >
              Current Game
            </NavigationMenuLink>
          </RouterLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <RouterLink to="/games-history">
            <NavigationMenuLink
              :class="isActiveRoute('games-history') && 'font-extrabold text-teal-400'"
              >Games History</NavigationMenuLink
            >
          </RouterLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <RouterLink to="/leaderboard">
            <NavigationMenuLink
              :class="isActiveRoute('leaderboard') && 'font-extrabold text-teal-400'"
              >Leaderboard</NavigationMenuLink
            >
          </RouterLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="flex gap-2" v-if="!auth.isAuthenticated">
      <p v-if="auth.isLoading">Loading...</p>
      <NavigationMenu>
        <NavigationMenuList class="gap-4">
          <NavigationMenuItem>
            <RouterLink to="/sign-up">
              <NavigationMenuLink :class="isActiveRoute('signup') && 'font-extrabold text-teal-400'"
                >Sign Up</NavigationMenuLink
              >
            </RouterLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <RouterLink to="/sign-in">
              <NavigationMenuLink :class="isActiveRoute('signin') && 'font-extrabold text-teal-400'"
                >Sign In</NavigationMenuLink
              >
            </RouterLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>

    <div class="flex gap-2" v-else>
      <Avatar size="sm">
        <AvatarImage :src="auth.user?.profilePicture || ''" />
        <AvatarFallback>{{ auth.user?.name.substring(0, 2) || 'UwU' }}</AvatarFallback>
      </Avatar>
      <Button
        :onclick="
          () => {
            auth.signOut()
            $router.push('/sign-in')
          }
        "
        >Sign Out</Button
      >
    </div>
  </header>
</template>
