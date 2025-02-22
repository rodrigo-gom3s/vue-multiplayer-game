<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    password: ''
})

const cancel = () => {
    router.back()
}

const login = () => {
    storeAuth.login(credentials.value)
}
</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8 bg-white dark:bg-gray-800 border-0">
    <CardHeader>
      <CardTitle class="text-black dark:text-white">Login</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @keydown.enter="login">
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class=" flex justify-between px-6 pb-6">
              <Button variant="outline" @click="cancel">
                Cancel
              </Button>
              <Button @click="login">
                Login
              </Button>
              </CardFooter>
  </Card>
</template>