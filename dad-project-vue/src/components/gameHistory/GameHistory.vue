<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Pagination, PaginationList, PaginationFirst, PaginationPrev, PaginationListItem, PaginationEllipsis, PaginationNext, PaginationLast } from '@/components/ui/pagination'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { useGamesStore } from '@/stores/games';
import { useAuthStore } from '@/stores/auth';
import GameHistoryFormFilter from './GameHistoryFormFilter.vue'
import { VueSpinnerPacman } from 'vue3-spinners'

const gamesStore = useGamesStore()
const authStore = useAuthStore()
gamesStore.loadGames()

</script>

<template>
  <div class="flex justify-center items-center p-4">
    <Card class="w-full max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md">
      <CardHeader class="px-4">
        <CardTitle class="text-lg md:text-xl text-black dark:text-white">Game History</CardTitle>
        <CardDescription class="text-sm md:text-base">Use the filters and click on each game to see the scoreboards.
          On the multiplayer games you can hover over the icon on the right to see the players and the number of pairs they discovered. 
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GameHistoryFormFilter class="p-4" />
        <div class="overflow-x-auto">
          <div v-if="gamesStore.isLoading" class="flex justify-center items-center h-32">
            <VueSpinnerPacman size="30" color="gray" />
          </div>
          <Table v-if="!gamesStore.isLoading" class="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead class="w-[150px] md:w-[200px] dark:text-white text-xs md:text-sm">Date</TableHead>
                <TableHead class="dark:text-white text-xs md:text-sm">Status</TableHead>
                <TableHead v-if="gamesStore.typeFilter == 'multiplayer' || authStore.isAdmin()" class="dark:text-white text-xs md:text-sm">Creator</TableHead>
                <TableHead v-if="gamesStore.typeFilter == 'multiplayer'" class="dark:text-white text-xs md:text-sm">Winner</TableHead>
                <TableHead class="dark:text-white text-xs md:text-sm">Board</TableHead>
                <TableHead class="dark:text-white text-xs md:text-sm">Total Time</TableHead>
                <TableHead class="dark:text-white text-xs md:text-sm">Total Moves</TableHead>
                <TableHead v-if="gamesStore.typeFilter == 'multiplayer'" class="dark:text-white text-xs md:text-sm w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="game in gamesStore.games" :key="game.id">
                    <TableCell class="font-medium dark:text-slate-300 text-xs md:text-sm">
                        {{ (new Date(game.ended_at)).toLocaleString() }}
                    </TableCell>
                    <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                        {{ game.status == 'E' ? 'Ended' : game.status == 'PE' ? 'Pending' : game.status == 'I' ? 'Interrupted' : 'In Progress' }}
                    </TableCell>
                    <TableCell v-if="game.type == 'M' || authStore.isAdmin()" class="dark:text-slate-300 text-xs md:text-sm">
                      {{ game.created ?? 'No Creator'}}
                    </TableCell>
                    <TableCell v-if="game.type == 'M'" class="dark:text-slate-300 text-xs md:text-sm">
                      {{ game.winner ?? 'No Winner'}}
                    </TableCell>
                    <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                      {{ game.board_id.board_cols + 'x' + game.board_id.board_rows }}
                    </TableCell>
                    <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                      {{ game.total_time ? game.total_time + ' seconds' : 'No Time' }}
                    </TableCell>
                    <TableCell class="dark:text-slate-300 text-xs md:text-sm">
                      {{ game.total_turns_winner ? game.total_turns_winner : 'No Moves' }}
                    </TableCell>
                    <HoverCard>
                        <TableCell v-if="game.type == 'M'" class="dark:text-slate-300 text-xs md:text-sm">
                        <HoverCardTrigger>
                          <Button>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                              <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/>
                            </svg>                    
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent class="dark:bg-slate-800">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead class="dark:text-white text-xs md:text-sm">User</TableHead>
                                <TableHead class="dark:text-white text-xs md:text-sm">Pairs Discovered</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow v-for="player in game.participants">
                                <TableCell class="dark:text-slate-300 text-xs md:text-sm">{{ player.user_nickname }}</TableCell>
                                <TableCell class="dark:text-slate-300 text-xs md:text-sm">{{ player.pairs_discovered }}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </HoverCardContent>
                      </TableCell>
                    </HoverCard>
                  </TableRow>
            </TableBody>
          </Table>
        </div>
        <br>
        <Pagination
          :v-slot="gamesStore.currentPage"
          :total="gamesStore.totalItems"
          :sibling-count="2"
          show-edges
          :default-page="gamesStore.currentPage"
        >
          <PaginationList v-slot="{ items }" class="flex items-center justify-center gap-1">
            <PaginationFirst @click="gamesStore.toPage(1)" />
            <PaginationPrev @click="gamesStore.previousPage" />
    
            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  @click="gamesStore.toPage(item.value)"
                  class="w-8 h-8 md:w-10 md:h-10 p-0"
                  :variant="gamesStore.currentPage == item.value ? 'default' : 'outline'"
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
            <PaginationNext @click="gamesStore.nextPage" />
            <PaginationLast @click="gamesStore.toPage(gamesStore.pages)" />
          </PaginationList>
        </Pagination>
      </CardContent>
    </Card>
  </div>
</template>
