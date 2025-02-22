<script setup>
import { useRoutingStore } from '@/stores/routing';
const routing = useRoutingStore();
const purchasePack = (pack) => {
    routing.route = {
        name: 'PaymentForm',
        params: { pack: pack },
    }
}
</script>

<template>
<div class="w-10/12 max-w-5xl mx-auto max-h-screen rounded-lg bg-white flex flex-col shadow-md dark:bg-gray-700">
    <!-- Header -->
    <p class="mt-8 ms-8 text-xl font-bold dark:text-white">Purchase Braincoins</p>

    <div class="m-8">
        <div class="grid grid-cols-3 gap-4">
        <!-- Basic Pack -->
        <div>
            <div class="bg-zinc-200 p-4 rounded-lg shadow-md text-slate-700 dark:bg-gray-600 dark:text-white">
                <p class="font-bold text-xl text-center">Basic Pack</p>
                <div class="flex items-center justify-center space-x-2 mt-2">
                    <p class="text-center text-2xl font-semibold">50</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brain text-pink-400">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                    </svg>
                </div>

                <p class="text-center text-lg mt-1">5.00€</p>
                <button @click="purchasePack('B')" class="mt-4 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-600">
                    Buy Now
                </button>
            </div>
        </div>

            
        <!-- Standard Pack -->
        <div>
            <div class="bg-zinc-200 p-4 rounded-lg shadow-md text-slate-700 dark:bg-gray-600 dark:text-white">
                <p class="font-bold text-xl text-center">Standard Pack</p>
                <div class="flex items-center justify-center space-x-2 mt-2">
                    <p class="text-center text-2xl font-semibold">100</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brain text-pink-400">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                    </svg>
                </div>

                <p class="text-center text-lg mt-1">10.00€</p>
                <button @click="purchasePack('S')" class="mt-4 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-600">
                    Buy Now
                </button>
            </div>
        </div>

        <!-- Premium Pack -->
        <div>
            <div class="bg-zinc-200 p-4 rounded-lg shadow-md text-slate-700 dark:bg-gray-600 dark:text-white">
                <p class="font-bold text-xl text-center">Premium Pack</p>
                <div class="flex items-center justify-center space-x-2 mt-2">
                    <p class="text-center text-2xl font-semibold">200</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brain text-pink-400">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                    </svg>
                </div>

                <p class="text-center text-lg mt-1">20.00€</p>
                <button @click="purchasePack('P')" class="mt-4 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-600">
                    Buy Now
                </button>
            </div>
        </div>

        </div>
    </div>
</div>
</template>            