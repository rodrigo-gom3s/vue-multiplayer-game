<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia';


const storeAuth = useAuthStore()

</script>

<template>
  <Card class="w-1/3 mx-auto my-8 p-4 px-8 bg-white dark:bg-gray-800 border-0 flex justify-center items-center">
    <CardHeader>
      <CardTitle class="text-black dark:text-white">Memory Card Game</CardTitle>
      <CardDescription>The best memory card game ever!</CardDescription>
    </CardHeader>
    <CardContent class="w-96 flex flex-col items-center" v-if="!storeAuth.isAdmin()">
        <RouterLink v-if="storeAuth.user" :to="{ name: 'gameMode'}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Play
        </RouterLink>
        <RouterLink v-else :to="{ name: 'game'}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start Game
        </RouterLink>
    </CardContent>
  </Card>
</template>
