<script setup>
import { onMounted, ref, watch } from 'vue'
import { Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import { Pagination, PaginationList, PaginationFirst, PaginationPrev, PaginationListItem, PaginationEllipsis, PaginationNext, PaginationLast } from '@/components/ui/pagination'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useRoute } from 'vue-router'
import { VueSpinnerPacman } from 'vue3-spinners';
import { useTransactionsStore } from '@/stores/transactions'
import { useRoutingStore } from '@/stores/routing'


const routing = useRoutingStore();
const authStore = useAuthStore()

const route = useRoute();
const transactionsStore = useTransactionsStore()
const params = route.params
const dropdown_filter = params.type != null ? ref(params.type) : ref("none");

if(params.type != null){
    transactionsStore.filter = params.type
}

if(params.nickname != null){
transactionsStore.nickname = params.nickname
}
watch(dropdown_filter, () => {
    filterChange();
});

const filterChange = () => {
    transactionsStore.resetPaginator()
    if (dropdown_filter.value != "none") {
        if (transactionsStore.nickname != "") {
            routing.route = {
                name: 'TransactionsByUserAndType',
                params: { type: dropdown_filter.value, nickname: transactionsStore.nickname },
            }
        } else {
            routing.route = {
                name: 'TransactionsByType',
                params: { type: dropdown_filter.value },
            }
        }
    } else {
        transactionsStore.filter = ""
        if (transactionsStore.nickname != "") {
            routing.route = {
                name: 'TransactionsByUser',
                params: { nickname: transactionsStore.nickname },
            };
        } else {
            routing.route = { name: 'transactions' };
        }
    }
}

onMounted(transactionsStore.loadTransactions);
</script>

<template>
    <div v-if="transactionsStore.isLoading == true" class="flex h-full">
        <div class="m-auto">
            <VueSpinnerPacman size="30" color="gray"/>
        </div>
    </div>
    <div v-if="transactionsStore.isLoading == false" class="w-10/12 max-w-5xl mx-auto max-h-screen rounded-lg bg-white flex flex-col shadow-md dark:bg-gray-700">
        <!-- Header -->
        <p class="mt-8 ms-8 text-xl font-bold dark:text-white">Transactions</p>
            <div class="flex justify-end me-8">
                <select class="p-2 h-10 w-full md:w-48 border border-gray-300 rounded-lg text-sm bg-white dark:bg-slate-600 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" v-model="dropdown_filter">
                    <option value="none">All</option>
                    <option value="I">Internal Transactions</option>
                    <option value="P">Purchases</option>
                    <option value="B">Bonuses</option>
                </select>
            </div>



        <!-- Table Container -->
        <div class="flex-grow bg-gray-100 m-8 rounded-sm overflow-y-auto dark:dark:bg-zinc-800 ">
            <Table>
                <!-- Table Header -->
                <TableHeader>
                    <TableRow >
                        <TableHead class="w-28 dark:text-slate-200">Transaction Date</TableHead>
                        <TableHead v-if="authStore.userType == 'A'" class="w-28 dark:text-slate-200 text-center">User Nickname</TableHead>
                        <TableHead class="text-center dark:text-slate-200">Type</TableHead>
                        <TableHead v-if="transactionsStore.filter=='I' || transactionsStore.filter==''"class="text-center dark:text-slate-200">Game</TableHead>
                        <TableHead v-if="transactionsStore.filter=='P' || transactionsStore.filter==''" class="text-center dark:text-slate-200">Cost (In Euros)</TableHead>
                        <TableHead v-if="transactionsStore.filter=='P' || transactionsStore.filter==''" class="text-center dark:text-slate-200">Payment Method</TableHead>
                        <TableHead v-if="transactionsStore.filter=='P' || transactionsStore.filter==''" class="text-center dark:text-slate-200">Payment Reference</TableHead>
                        <TableHead class="text-center dark:text-slate-200">Brain Coins</TableHead>
                    </TableRow>
                </TableHeader>
                
                <!-- Table Body -->
                <TableBody>
                    <TableRow v-for="transaction in transactionsStore.transactions" class="h-12">
                        <TableCell class="font-medium dark:text-slate-200">{{transaction.transaction_datetime}}</TableCell>
                        <TableCell v-if="authStore.userType == 'A'" class="w-28 text-center dark:text-slate-200">{{transaction.user != null ? transaction.user : '---------'}}</TableCell>
                        <TableCell class="text-center dark:text-slate-200">{{transaction.type}}</TableCell>
                        <TableCell v-if="transactionsStore.filter=='I' || transactionsStore.filter==''" class="text-center dark:text-slate-200">{{transaction.game != null ? transaction.game : '---------'}}</TableCell>
                        <TableCell v-if="transactionsStore.filter=='P' || transactionsStore.filter==''" class="text-center dark:text-slate-200">{{transaction.euros != null ? transaction.euros + '€' : '---------'}}</TableCell>
                        <TableCell v-if="transactionsStore.filter=='P' || transactionsStore.filter==''" class="text-center dark:text-slate-200">{{transaction.payment_type != null ? transaction.payment_type : '---------'}}</TableCell>
                        <TableCell v-if="transactionsStore.filter=='P' || transactionsStore.filter==''"class="text-center dark:text-slate-200">{{transaction.payment_reference != null ? transaction.payment_reference : '---------'}}</TableCell>
                        <TableCell class="text-center dark:text-slate-200">{{transaction.brain_coins}}</TableCell>
                    </TableRow>
                    <!-- Add more rows here -->
                </TableBody>
            </Table>
        </div>
        <div class="mb-5 flex justify-center" v-if="!transactionsStore.isLoading">
            <Pagination
          :v-slot="transactionsStore.currentPage"
          :total="transactionsStore.totalItems"
          :sibling-count="2"
          show-edges
          :default-page="transactionsStore.currentPage"
        >
          <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-1">
            <PaginationFirst @click="transactionsStore.toPage(1)" />
            <PaginationPrev @click="transactionsStore.previousPage" />
    
            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  @click="transactionsStore.toPage(item.value)"
                  class="w-8 h-8 md:w-10 md:h-10 p-0"
                  :variant="transactionsStore.currentPage == item.value ? 'default' : 'outline'"
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
            <PaginationNext @click="transactionsStore.nextPage" />
            <PaginationLast @click="transactionsStore.lastPage" />
          </PaginationList>
        </Pagination>
        </div>
    </div>
</template>