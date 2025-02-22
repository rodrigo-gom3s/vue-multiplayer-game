<script setup>
import { Card } from '@/components/ui/card'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ref } from 'vue'
import GeneralStatistics from './GeneralStatistics.vue';
import { useAuthStore } from '@/stores/auth';
import MyStats from './MyStats.vue';
import AdminStats from './AdminStats.vue';

const authStore = useAuthStore()

</script>
<template>
    <div class="flex justify-center items-center p-4">
        <Card class="w-full max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md">
            <CardHeader class="px-4">
                <CardTitle class="text-lg md:text-xl text-black dark:text-white">Statistics</CardTitle>
                <CardDescription class="text-sm md:text-base">Here you can see the overall statistics about this game.</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="overflow-x-auto">
                    <Tabs default-value="general">
                        <TabsList class="dark:bg-slate-600 dark:text-slate-300">
                            <TabsTrigger value="general">
                                General
                            </TabsTrigger>
                            <!-- Only show the following tab if the user is authenticated -->
                            <TabsTrigger v-if="authStore.user" value="mystats">
                                My Stats
                            </TabsTrigger>
                            <!-- Only show the following tab if the user is an admin -->
                            <TabsTrigger v-if="authStore.isAdmin()" value="business">
                                Admin
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="general">
                            <!-- General statistics -->
                            <GeneralStatistics />
                        </TabsContent>
                        <TabsContent value="mystats">
                            <!-- Statistics about the logged in user -->
                            <MyStats />
                        </TabsContent>
                        <TabsContent value="business">
                            <!-- Statistics for the admin (business)-->
                            <AdminStats />
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    </div>    
</template>