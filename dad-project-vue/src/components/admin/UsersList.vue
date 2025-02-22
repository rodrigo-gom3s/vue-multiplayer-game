<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationList, PaginationFirst, PaginationPrev, PaginationListItem, PaginationEllipsis, PaginationNext, PaginationLast } from '@/components/ui/pagination'
import { VueSpinnerPacman } from 'vue3-spinners'
import { Button } from '@/components/ui/button'
import { inject } from 'vue'
import UserListFormSearch from './UserListFormSearch.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'




const searchQuery = ref('')
const userStore = useUsersStore()
const { toast } = useToast()   
const alertDialog = inject('alertDialog')
const storeAuth = useAuthStore()

const currentUserId = computed(() => storeAuth.user.id)


const removeAccountConfirmed = async (id) => {
  try {
    await userStore.removeUser(id)
    toast({
                description: `User:${id}Removed!`,
                })
    userStore.toPage(1)
  } catch (error) {
    console.error('Error removing account:', error)
  }
}

const removeAccount = (id) => {
  alertDialog.value.open(
    () => removeAccountConfirmed(id), // Passando o id como argumento
    'Are you sure?',
    'Cancel',
    `Yes, DELETE user: ${id}`,
    `This action cannot be undone. This will permanently delete the user profile.`
  );
};

const toggleBlockUserConfirmed = async (user) => {
  try {
    await userStore.toggleBlockUser(user.id)
    toast({
                description: `User:${user.id} ${user.blocked ? 'Unblocked' : 'Blocked'}!`,
                })
    userStore.toPage(1)
  } catch (error) {
    console.error('Error blocking/unblocking user:', error)
  }
}

const toggleBlockUser = (user) => {
    if(user.blocked){
        alertDialog.value.open(
            () => toggleBlockUserConfirmed(user), // Passando o id como argumento
            'Are you sure?',
            'Cancel',
            `Yes, UNBLOCK user: ${user.id}`,
            `This action cannot be undone. This will UNBLOCK the user profile.`
          );
    }else{
    alertDialog.value.open(
        () => toggleBlockUserConfirmed(user), // Passando o id como argumento
        'Are you sure?',
        'Cancel',
        `Yes, BLOCK user: ${user.id}`,
        `This action cannot be undone. This will BLOCK the user profile.`
  );}
};


userStore.loadUsers()




</script>

<template>
    <div class="flex justify-center items-center p-4">
      <Card class="w-full max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md">
        <CardHeader class="px-4">
          <CardTitle class="text-lg md:text-xl text-black dark:text-white">Users List</CardTitle>
          <CardDescription class="text-sm md:text-base">
            List of all users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <div v-if="userStore.isLoading" class="flex justify-center items-center h-32">
                <VueSpinnerPacman size="30" color="gray" />
            </div>
            <Table v-if="!userStore.isLoading" class="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[150px] md:w-[200px] dark:text-white text-xs md:text-sm">ID</TableHead>
                  <TableHead class="dark:text-white text-xs md:text-sm">Type</TableHead>
                  <TableHead class="dark:text-white text-xs md:text-sm">Name</TableHead>
                  <TableHead class="dark:text-white text-xs md:text-sm">Email</TableHead>
                  <TableHead class="dark:text-white text-xs md:text-sm">Nickname</TableHead>
                  <TableHead class="dark:text-white text-xs md:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in userStore.users.filter(user => user.id !== currentUserId)" :key="user.id">
                  <TableCell class="font-medium dark:text-slate-300 text-xs md:text-sm">
                    {{ user.id }}
                  </TableCell>
                  <TableCell class="font-medium dark:text-slate-300 text-xs md:text-sm">
                    {{ user.type }}
                  </TableCell>
                  <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                    {{ user.name }}
                  </TableCell>
                  <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                    {{ user.email }}
                  </TableCell>
                  <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                    {{ user.nickname }}
                  </TableCell>
                  <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                    <button @click="removeAccount(user.id)" class="bg-red-500 text-white px-2 py-1 rounded">Remove Account</button>
                    <button @click="toggleBlockUser(user)" :class="user.blocked ? 'bg-green-500' : 'bg-yellow-500'" class="text-white px-2 py-1 rounded ml-2">
                    {{ user.blocked ? 'Unblock' : 'Block' }}
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <br>
          <Pagination
            v-if="!userStore.isLoading"
            :v-slot="userStore.currentPage"
            :total="userStore.totalItems"
            :sibling-count="2"
            show-edges
            :default-page="userStore.currentPage"
          >
            <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-1">
              <PaginationFirst @click="userStore.toPage(1)" />
              <PaginationPrev @click="userStore.previousPage" />
      
              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    @click="userStore.toPage(item.value)"
                    class="w-8 h-8 md:w-10 md:h-10 p-0"
                    :variant="userStore.currentPage == item.value ? 'default' : 'outline'"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis
                  class="dark:text-white"
                  v-else
                  :key="item.type"
                  :index="index"
                />
              </template>
              <PaginationNext @click="userStore.nextPage" />
              <PaginationLast @click="userStore.toPage(userStore.pages)" />
            </PaginationList>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  </template>