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
    CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inject } from 'vue'


const router = useRouter()
const alertDialog = inject('alertDialog')
const storeAuth = useAuthStore()

const currentPassword = ref('');

const cancel = () => {
    router.back()
}

const removeAccount = async () => {
    
    const isPasswordValid = await storeAuth.validatePassword(currentPassword.value)
    if (!isPasswordValid) {
      return 
    }
  

  alertDialog.value.open(
  removeAccountConfirmed,
'Are you sure?', 'Cancel', `Yes, DELETE my account`,
 `This action cannot be undone. This will permanently delete your profile, and you will lose all your data.`
  )
  
}

const removeAccountConfirmed = async () => {
    storeAuth.removeAccount() //fazer o remove account########################################################################################
    router.push({ name: 'login' })
}

</script>

<template>
    <Card class="w-[450px] mx-auto my-8 p-4 px-8 bg-white dark:bg-gray-800 border-0">
    <CardHeader>
      <CardTitle class="text-black dark:text-white">Remove Account</CardTitle>
      <CardDescription>This action will permanently delete your account</CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
          <div class="flex flex-col space-y-1.5">
            <Label class="text-black dark:text-white" for="currentPassword">Your current password</Label>
            <Input id="currentPassword" type="password" placeholder="CurrentPassword" v-model="currentPassword" class="dark:bg-slate-300" />
            <!--<ErrorMessage :errorMessage="storeError.fieldMessage('currentPassword')"></ErrorMessage>-->
          </div>
        </CardContent>
        <CardFooter class="flex flex-col text-center space-y-4 mt-6">
          <Button @click.prevent="removeAccount" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ">
            Remove Account
          </Button>
          <Button @click.prevent="cancel" class="px-4 py-2 ">Cancel</Button>
        </CardFooter>
  </Card>
</template>