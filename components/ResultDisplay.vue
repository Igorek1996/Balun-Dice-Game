<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold">Game Results</h2>

    <div class="border border-gray-300 rounded overflow-auto">
      <div class="min-w-[500px] max-h-72 overflow-y-auto">
        <div class="grid grid-cols-5 bg-gray-100 sticky top-0 z-10">
          <div class="p-2 whitespace-nowrap border-b border-r font-semibold">#</div>
          <div class="p-2 whitespace-nowrap border-b border-r font-semibold">Results</div>
          <div class="p-2 whitespace-nowrap border-b border-r font-semibold">Bet</div>
          <div class="p-2 whitespace-nowrap border-b border-r font-semibold">Win</div>
          <div class="p-2 whitespace-nowrap border-b font-semibold">Combo</div>
        </div>
        <div v-for="(item, index) in gameStore.history" :key="index" class="grid grid-cols-5">
          <div class="p-2 whitespace-nowrap border-b border-r">{{ index + 1 }}</div>
          <div class="p-2 whitespace-nowrap border-b border-r">{{ item.results.join(', ') }}</div>
          <div class="p-2 whitespace-nowrap border-b border-r">{{ item.bet }}</div>
          <div class="p-2 whitespace-nowrap border-b border-r">{{ item.win }}</div>
          <div class="p-2 whitespace-nowrap border-b">{{ item.combo }}</div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-2">RTP Stats</h2>
      <div class="border border-gray-300 rounded overflow-auto">
        <div class="min-w-[500px]">
          <div class="grid grid-cols-3 border border-gray-300 text-center">
            <div class="p-2 whitespace-nowrap border-b border-r font-semibold">ALL_USER_WINS</div>
            <div class="p-2 whitespace-nowrap border-b border-r font-semibold">ALL_USER_BETS</div>
            <div class="p-2 whitespace-nowrap border-b font-semibold">RTP (%)</div>

            <div class="p-2 border-r">{{ animatedWins.toFixed(0) }}</div>
            <div class="p-2 border-r">{{ animatedBets.toFixed(0) }}</div>
            <div class="p-2">{{ animatedRTP.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Баланс -->
    <div class="mt-4 p-2 bg-gray-50 border rounded">
      <p><strong>Баланс:</strong> {{ animatedBalance.toFixed(0) }}</p>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'

const gameStore = useGameStore()

// Анимированные значения
const animatedWins = ref(0)
const animatedBets = ref(0)
const animatedRTP = ref(0)
const animatedBalance = ref(gameStore.balance)

// Функция плавного изменения числа
function animateValue(refVar, target, duration = 500) {
  const start = refVar.value
  const diff = target - start
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    refVar.value = start + diff * progress
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

// Слежение за store для анимации
watch(() => gameStore.allUserWins, (val) => animateValue(animatedWins, val))
watch(() => gameStore.allUserBets, (val) => animateValue(animatedBets, val))
watch(() => gameStore.getRTP(), (val) => animateValue(animatedRTP, val))
watch(() => gameStore.balance, (val) => animateValue(animatedBalance, val))
</script>
