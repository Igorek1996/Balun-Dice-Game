<template>
  <div>
    <h2 class="text-lg font-bold">Simulation</h2>

    <div class="flex flex-col gap-2">
      <input v-model.number="attempts" type="number" min="1" placeholder="Quantity (default 10000)"
        class="w-full border rounded px-3 py-2" />
      <input v-model.number="bet" type="number" min="10" placeholder="Bet (default 10)"
        class="border rounded px-3 py-2 w-full" />
      <button @click="simulate" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Run
      </button>
    </div>

    <div class="mt-4">
      <p><strong>RTP:</strong> {{ gameStore.getRTP().toFixed(2) }}%</p>
      <p><strong>Общая сумма ставок:</strong> {{ gameStore.allUserBets }}</p>
      <p><strong>Общая сумма выигрышей:</strong> {{ gameStore.allUserWins }}</p>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'

const gameStore = useGameStore()

const attempts = ref()
const bet = ref()

const simulate = () => {
  gameStore.simulateRolls(attempts.value, bet.value)
}
</script>
