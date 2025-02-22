<script setup>
import { ref } from 'vue';
import { useTransactionsStore } from '@/stores/transactions'; 
import { watch } from 'vue'
import { inject } from 'vue'
import { useAuthStore } from '@/stores/auth';


const transactionsStore = useTransactionsStore()
let card
const alertDialog = inject('alertDialog')
const storeAuth = useAuthStore()
  /*alertDialog.value.open(insertTransaction, 'Purchase Confirmation', 'Cancel', `Yes`,
   `Are you sure you want to buy this product? You won't be able to refund this purchase.`)*/

  const userCards = ref([])
  if(storeAuth.cards != null){
    userCards.value = storeAuth.cards
  }

   const cards =ref([{
      price: 50,
      image: '/cards/semFace_2.png',
      bought: false,
      equiped: false
    },{
      price: 50,
      image: '/cards/semFace_3.png',
      bought: false,
      equiped: false
    },{
      price: 50,
      image: '/cards/semFace_4.png',
      bought: false,
      equiped: false
    }
  ])

const getUserCards = () => {
  userCards.value = storeAuth.cards == null ? [] : JSON.parse(storeAuth.cards)
  if(userCards.value.length > 0){
    userCards.value.forEach(card => {
      cards.value.forEach(cardShop => {
        if(cardShop.image == card.image){
          cardShop.bought = true
          cardShop.equiped = card.equiped
        }
      })
    });
  }
}

const buyCard = (card_received) => {
    card = card_received
    alertDialog.value.open(registerCardPurchase, 'Purchase Confirmation', 'Cancel', `Yes`,
    `Are you sure you want to buy this product? You won't be able to refund this purchase.`)
}

const  changeEquipCardStatus = async (card) => {
    userCards.value.forEach(user_card =>{
      if(card.image == user_card.image){
        user_card.equiped = !user_card.equiped
      }else{
        user_card.equiped = false
      }
    })

    let is_registered = await storeAuth.updateUserCards(userCards.value)
    if(is_registered){
      await storeAuth.getUserDataAfterUpdate().then(() =>{
        getUserCards()
      })
    }
}

const registerCardPurchase = async () => {
  userCards.value.push(card)
  await transactionsStore.registerCardPurchase(userCards.value, card).then(async () =>{
    await storeAuth.getUserDataAfterUpdate().then(() =>{
      getUserCards()
    })
  })
}

getUserCards();
</script>

<template>
<div class="w-10/12 max-w-5xl mx-auto max-h-screen rounded-lg bg-white flex flex-col shadow-md dark:bg-gray-700">
    <p class="mt-8 ms-8 text-xl font-bold dark:text-white">Buy Cards</p>

  <div class="mx-8 my-8 py-4 overflow-auto bg-gray-100 dark:bg-gray-900 rounded shadow-md">
    <div class="flex flex-wrap justify-center gap-6">

  <div v-for="card in cards" class="flex flex-col items-center bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
    <img :src="card['image']" alt="Produto 3" height="217" width="150" class="rounded-lg object-cover" />
    <div class="mt-4">
      <button v-if="card.bought == false" @click="buyCard(card)" class=" bg-pink-500 text-white rounded-lg hover:bg-pink-600 px-4 py-2 flex items-center">
        {{card['price']}}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brain text-white ms-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                    </svg>
      </button>
      <button v-if="card.bought == true" @click="changeEquipCardStatus(card)" class=" bg-pink-500 text-white rounded-lg hover:bg-pink-600 px-4 py-2 flex items-center">
        {{card['equiped'] ? 'Unequip': 'Equip'}}
      </button>
    </div>
  </div>
</div>

  </div>
</div>
</template>
            