<script setup>
    import { defineProps } from 'vue'
    import { useAuthStore } from '@/stores/auth';
    const props = defineProps(['card'])
    const storeAuth = useAuthStore()
    const emits = defineEmits(['flip'])

    const backOfCard = storeAuth.equippedCard

    const flip = () => {
        
        emits('flip', props.card)
    }

</script>
<template>
    <img :src="card.flipped || card.matched? card.src : backOfCard" alt="card" @click="flip" />
</template>