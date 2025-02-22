<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { CalendarSearch } from 'lucide-vue-next';


const userStore = useUsersStore()

//const searchName = ref('')

const handleKeyUp = () => {
  userStore.currentPage = 1
  userStore.loadUsers()
}

const clearSearchName = () => {
  userStore.searchName = ''
  userStore.currentPage = 1
  userStore.loadUsers()
}

//@keyup="handleKeyUp"
</script>

<template>
    <div class="container mx-auto my-8 p-4">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">Search Users</h1>
      <h5 class="text-l mb-4 dark:text-white">Filter by name</h5>
        <div class="relative mb-4">
          <input
          type="text"
          v-model="userStore.searchName"
          placeholder="Search by name"
          class="w-full p-2 border rounded dark:bg-slate-300"
        />
          <svg v-if="userStore.searchName" @click="clearSearchName" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer hover:text-red-700"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </div>
        <h5 class="text-l mb-4 dark:text-white">Filter by type</h5>
        <div class="relative mb-4">
          <select
            v-model="userStore.searchUserType"
            class="w-full p-2 border rounded dark:bg-slate-300"
          >
            <option value="">All Users</option>
            <option value="A">Admin</option>
            <option value="P">Player</option>
            </select>
          </div>
        <div class="relative mb-4 flex justify-end">
          <button @click="handleKeyUp" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Search
          </button>
        </div>
      
    </div>
  </template>