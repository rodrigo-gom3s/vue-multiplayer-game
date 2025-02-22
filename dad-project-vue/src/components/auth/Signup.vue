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
import CreateAccount from './CreateAccount.vue'


</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8 bg-white dark:bg-gray-800 border-0">
    <CardHeader>
      <CardTitle class="text-black dark:text-white">Sign up</CardTitle>
      <CardDescription>Enter your information to create your account</CardDescription>
    </CardHeader>
    <CreateAccount userType="P"/>
  </Card>
</template>