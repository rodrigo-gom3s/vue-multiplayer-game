import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/auth/Login.vue'
import { useAuthStore } from '@/stores/auth'
import Game from '@/components/Game.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import CardShop from '@/components/purchases/CardShop.vue'
import Profile from '@/components/Profile.vue'
import Home from '@/components/Home.vue'
import GameHistory from '@/components/gameHistory/GameHistory.vue'
import Signup from '@/components/auth/Signup.vue'
import EditProfile from '@/components/EditProfile.vue'
import RemoveAccount from '@/components/RemoveAccount.vue'
import ChossingGameMode from '@/components/ChossingGameMode.vue'
import AdminTab from '@/components/admin/AdminTab.vue'
import ChoosingScoreboards from '@/components/scoreboards/Scoreboards.vue'
import Statistics from '@/components/stats/Statistics.vue'
import MultiplayerGames from '@/components/multiplayer/MultiplayerGames.vue'
import PurchaseOptions from '@/components/transactions/PurchaseOptions.vue'
import PaymentForm from '@/components/transactions/PaymentForm.vue'
import { useMultiplayerGamesStore } from '@/stores/multiplayerGames'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/gameMode',
      name: 'gameMode',
      component: ChossingGameMode,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/me',
      name: 'myprofile',
      component: Profile,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions
    },
    { 
      path: '/transactions/type/:type', 
      name: 'TransactionsByType', 
      component: Transactions 
    },
    { 
      path: '/transactions/users/:nickname', 
      name: 'TransactionsByUser', 
      component: Transactions 
    },
    { 
      path: '/transactions/users/:nickname/type/:type', 
      name: 'TransactionsByUserAndType', 
      component: Transactions 
    },
    {
      path: '/history',
      name: 'history',
      component: GameHistory,
    },
    {
      path: '/shop',
      name: 'CardShop',
      component: CardShop
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/braincoins',
      name: 'purchaseOptions',
      component: PurchaseOptions,
    },
    {
      path: '/braincoins/buy/:pack',
      name: 'PaymentForm',
      component: PaymentForm,
    },
    {
      path: '/editprofile',
      name: 'editprofile',
      component: EditProfile,
    },
    {
      path: '/removeAccount',
      name: 'removeAccount',
      component: RemoveAccount,
    },
    {
      path: '/adminTab',
      name: 'adminTab',
      component: AdminTab,
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: ChoosingScoreboards,
    },
    {
      path: '/stats',
      name: 'stats',
      component: Statistics,
    },
    {
      path: '/multiplayerGames',
      name: 'multiplayerGames',
      component: MultiplayerGames,
    },
  ],
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
    const storeAuth = useAuthStore()
    const storeGames = useMultiplayerGamesStore()
    if (handlingFirstRoute) {
        handlingFirstRoute = false
        await storeAuth.restoreToken()
    }

    if (to.name == "myprofile" && (!storeAuth.user)) {
      next({ name: 'login' })
      return
    }

    if (to.name == "CardShop" && (!storeAuth.user)) {
      next({ name: 'login' })
      return
    }

    if (to.name == "editprofile" && (!storeAuth.user)) {
      next({ name: 'login' })
      return
    }

    if (to.name == "PaymentForm" && (!storeAuth.user)) {
      next({ name: 'login' })
      return
    }

    if (to.name == "purchaseOptions" && (!storeAuth.user)) {
      next({ name: 'login' })
      return
    }

    if (to.name == "removeAccount" && (storeAuth.userType == "A")) {
      next({ name: 'myprofile' })
      return
    }

    if(to.name == "removeAccount" && (!storeAuth.user)){
      next({name: 'login'})
      return

    }

    if(to.name == "multiplayerGames" && (!storeAuth.user)){
      next({name: 'gameMode'})
      return

    }
    
    if((to.name == "game" || to.name == "multiplayerGames" || to.name == "gameMode"  ) && (storeAuth.isAdmin())){
      next({name: 'adminTab'})
      return

    }
    
  
    if(from.name == "multiplayerGames"){
      storeGames.leaveTabMultiplayerGames()
      next()
      return
      
    }
    

    // // routes "updateTask" and "updateProject" are only accessible when user is logged in
    // if (((to.name == 'updateTask') || (to.name == 'updateProject')) && (!storeAuth.user)) {
    //     next({ name: 'login' })
    //     return
    // }
    // all other routes are accessible to everyone, including anonymous users

    if(to.name == "adminTab" && storeAuth.userType != "A"){
      next({name: 'myprofile'})
      return
    }

    if(to.name == "signup" && storeAuth.user){
      next({name: 'myprofile'})
      return
    } 

    if(to.name == "login" && storeAuth.user){
      next({name: 'myprofile'})
      return
    } 
    
    if(to.name == "transactions" && (storeAuth.user == null)){
      next({name: 'login'})
      return
    } 

    if(to.name == "TransactionsByType" && (storeAuth.user == null) || (to.name == "TransactionsByType" && (storeAuth.userType != "A"))){
      next({name: 'login'})
      return
    } 
    if(to.name == "TransactionsByUser" && (storeAuth.user == null) || (to.name == "TransactionsByUser" && (to.params.nickname != storeAuth.user.nickname && storeAuth.userType != "A"))){
      next({name: 'login'})
      return
    } 

    if(to.name == "TransactionsByUserAndType" && (storeAuth.user == null) || (to.name == "TransactionsByUser" && (to.params.nickname != storeAuth.user.nickname) && (storeAuth.userType != "A"))){
      next({name: 'login'})
      return
    } 
    
    if(to.name == "transactions" && (storeAuth.userType != "A")) 
    {
      next({name: 'TransactionsByUser', params: { nickname: storeAuth.user.nickname }})
      return
    }
    if(to.name == "purchaseOptions" && (storeAuth.userType == "A")) 
    {
      next({name: 'myprofile'})
      return
    }
    if(to.name == "CardShop" && (storeAuth.userType == "A")) 
    {
      next({name: 'myprofile'})
      return
    }
    
    next()

})

export default router
