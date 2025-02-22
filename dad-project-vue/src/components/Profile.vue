<script setup>
import { computed, ref } from 'vue'
import Card from './ui/card/Card.vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router';

const storeAuth = useAuthStore()

</script>

<template>
    <Card class="w-[450px] mx-auto my-8 p-8 bg-white dark:bg-gray-800 border-0">
        <div class="max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Profile</h2>
        </div>
        <div>
            <img :src="storeAuth.userPhotoUrl" alt="avatar" class="rounded-full h-24 w-24 mx-auto" />
        </div>
        <div class="mt-4">
            <p class="text-center text-xl text-gray-900 dark:text-white">@{{ storeAuth.nickname }}</p>
            <p class="text-center text-md text-gray-900 dark:text-white">{{ storeAuth.userName }}</p>
            <p class="text-center text-sm text-gray-600 dark:text-white">{{ storeAuth.userEmail }}</p>
        </div>
        <div class="mt-4">
            <p class="text-sm text-gray-600 dark:text-white"><b>Games Won: </b>{{ storeAuth.gamesWon }}</p>
            <p class="text-sm text-gray-600 dark:text-white"><b>User Type: </b>{{ storeAuth.userType == 'A' ? 'Admin' : 'Player' }}</p>
        </div>
        <div class="flex flex-col space-y-4 mt-6 text-center">
            <RouterLink :to="{ name: 'editprofile' }" class="w-40 mx-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2">
            <span>Edit Profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
        </RouterLink>
        <RouterLink v-show="storeAuth.canDeleteOwnAccount()" :to="{ name: 'removeAccount' }" class="w-40 mx-auto py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center space-x-2">
            <span>Remove Account</span> 
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </RouterLink>
        </div>

    </Card>
</template>