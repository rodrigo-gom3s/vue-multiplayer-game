<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { defineProps, computed } from 'vue'

const props = defineProps({
  userType: {
    type: String,
    default: 'P'
  }
})

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()
const previewUrl = ref(null) // Ref to store the preview URL

const credentials = ref({
    email: '',
    password: '',
    name: '',
    nickname: '',
    type: props.userType,
    photo_filename: null
})
/*
const onFileChange = (event) => {
    const file = event.target.files[0]
    credentials.value.photo_filename = file
}*/

const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
            credentials.value.photo_filename = reader.result
            previewUrl.value = reader.result // Set the preview URL
        }
        reader.readAsDataURL(file)
    } else {
        storeError.setErrorMessages('The selected file must be an image.')
        credentials.value.photo_filename = null
        previewUrl.value = null // Clear the preview URL
    }
}

const cancel = () => {
    router.back()
}

const signup = () => {
    storeAuth.signup(credentials.value)
    credentials.value = {
        email: '',
        password: '',
        name: '',
        nickname: '',
        type: props.userType,
        photo_filename: null
    }
}

const buttonText = computed(() => {
  return props.userType === 'A' ? 'Create Admin Account' : 'Sign Up'
})

</script>

<template>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="email">Name</Label>
            <Input id="name" type="text" placeholder="User Name" v-model="credentials.name" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="email">Nickname</Label>
            <Input id="nickname" type="text" placeholder="User Nickname" v-model="credentials.nickname" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="password">Password</Label>
            <Input id="password" type="password" placeholder="User Password" v-model="credentials.password" class="dark:bg-slate-300" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="photo_filename">Insert your photo or avatar</Label>
            <Input id="photo_filename" type="file" @change="onFileChange" class="dark:bg-slate-300 cursor-pointer" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('photo_filename')"></ErrorMessage>
            <div v-if="previewUrl" class="mt-4 text-center">
              <Label class="text-black dark:text-white">Image Preview</Label>
              <img :src="previewUrl" alt="Image Preview" class="w-24 h-24 rounded-full mx-auto" />
            </div>
          </div>
        </div>
        <br>
        <div class="flex justify-end space-x-4">
          <Button @click.prevent="cancel">Cancel</Button>
          <Button class="bg-green-600 text-white rounded hover:bg-blue-700 transition" @click.prevent="signup">{{ buttonText }}</Button>
        </div>
      </form>
    </CardContent>
</template>