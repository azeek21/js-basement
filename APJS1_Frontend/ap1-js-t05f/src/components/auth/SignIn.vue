<script setup lang="ts">
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/vue-query'
import { sleep } from '@/lib/services/base'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Loader } from '../ui/loader'
const cantBeEmptyMessage = "Field can't be emtpy"
const auth = useAuthStore()
const router = useRouter()
import { mockSignIn, signIn, signInValidator } from '@/lib/services/auth'
import { monkeyThrow } from '@/lib/utils'
import { toast } from 'vue-sonner'
import { getMockUser } from '@/lib/services/user'

const { isPending, isError, isSuccess, error, mutate } = useMutation({
  mutationKey: ['sign-up'],
  mutationFn: monkeyThrow(mockSignIn, 'Sign in Error'),
  onSuccess: async (res: SignInSuccess) => {
    router.replace('/')
    auth.user = getMockUser()
    auth.token = res.token
    auth.refreshToken = res.refreshToken
    auth.expires = res.expires
    auth.isAuthenticated = true
  },
  onError: (e) => {
    toast(String(e))
  },
})

const isLoading = ref(false)
const formSchema = toTypedSchema(signInValidator)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  mutate(values)
})
</script>

<template>
  <div class="m-auto max-w-screen-sm w-full border rounded-lg p-4 shadow-lg gap-4">
    <form class="flex flex-col gap-2" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="login">
        <FormItem>
          <FormLabel>Login</FormLabel>
          <FormControl>
            <Input type="text" placeholder="login" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button :disabled="isPending" type="submit">Sign In </Button>
      <Loader v-if="isPending" />
      <p class="text-right">
        Don't have account yet?
        <RouterLink class="text-blue-300" to="/sign-up">Sign Up here</RouterLink>
      </p>

      <p class="text-red-400" v-if="isError && !isPending">
        {{ String(error) }}
      </p>
    </form>
  </div>
</template>
