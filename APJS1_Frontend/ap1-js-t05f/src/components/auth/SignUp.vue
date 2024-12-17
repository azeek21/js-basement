<script setup lang="ts">
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { sleep } from '@/lib/services/base'
import { Loader } from '../ui/loader'

const cantBeEmptyMessage = "Field can't be emtpy"

const router = useRouter()

const { isPending, isError, isSuccess, error, mutate } = useMutation({
  mutationKey: ['sign-up'],
  mutationFn: sleep.bind(null, 2000),
  onSuccess: () => {
    router.replace('/sign-in')
  },
})

const formSchema = toTypedSchema(
  z.object({
    login: z.string().min(4, cantBeEmptyMessage),
    password: z.string().min(4, cantBeEmptyMessage),
    name: z.string(),
    profilePictureUrl: z.string().url('Not a valid link (url)'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const passwordRepeat = ref('')
const repeatError = ref(false)

const onSubmit = form.handleSubmit((values) => {
  mutate()
})
</script>

<template>
  <div class="m-auto max-w-screen-sm w-full border rounded-lg p-4 shadow-lg">
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

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="name" v-bind="componentField" />
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

      <FormField name="confirm" standalone err>
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              v-model="passwordRepeat"
              :onblur="(e) => (repeatError = e.target.value !== form.values.password)"
            />
          </FormControl>
          <p v-if="repeatError" class="text-red-400">Password confirmation should match</p>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="profilePictureUrl">
        <FormItem>
          <FormLabel>Profile Picture Link</FormLabel>
          <FormControl>
            <Input type="url" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button :disabled="isPending" type="submit">Sign Up</Button>
      <Loader v-if="isPending" />

      <p class="text-right">
        Already have an account?
        <RouterLink class="text-blue-300" to="/sign-in">Sign in </RouterLink>
      </p>

      <p class="text-red-400" v-if="isError && !isPending">
        {{ String(error) }}
      </p>
    </form>
  </div>
</template>
