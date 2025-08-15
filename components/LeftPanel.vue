<template>
  <div class="p-4 bg-gray-100 ">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Balut Dice</h1>

    <div class="bg-white shadow-md rounded-lg p-4 space-y-6">
      <!-- Dice -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Dice</h2>
        <div class="grid grid-cols-5 gap-1 justify-items-center">
          <div v-for="(dice, index) in displayDices" :key="index"
            class="rounded-lg max-w-16 flex items-center justify-center text-lg font-bold text-gray-700">
            <img :src="`/dice-${dice || 1}.png`" :alt="`Dice ${dice}`" />
          </div>
        </div>
      </div>

      <!-- Prices -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Prices</h2>
        <table class="w-full border border-gray-200 text-sm">
          <tbody>
            <tr v-for="(combo, index) in combos" :key="index" class="border-b hover:bg-gray-50"
              :class="highlightCombo(combo)">
              <td class="px-2 py-1">{{ combo.title }}</td>
              <td class="px-2 py-1 text-right">{{ combo.x }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bet -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Bet</h2>
        <form class="flex items-center gap-2" @submit.prevent="rollDices">
          <input id="bet" name="bet" v-model="bet" type="number"
            class="w-20 border rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" :disabled="gameStore.isDiceRolling"
            class="cursor-pointer px-4 py-1 rounded-lg font-semibold shadow text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50">
            ROLL
          </button>
        </form>
      </div>

      <!-- Balance -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Your balance</h2>
        <div class="text-xl font-bold text-green-600">{{ gameStore.balance }}</div>
      </div>

      <Simulation />
    </div>
  </div>
</template>

<script setup>
import { useConstants } from '#imports'
import { useGameStore } from '~/store/gameStore'
import Simulation from './Simulation.vue'

const gameStore = useGameStore()
const Constants = useConstants()
const bet = ref(10)

const simulate = () => {
  gameStore.simulateRolls(10000, 1) // 10к игр по 1 монете
}


const combos = [
  { title: 'Pair', x: 'x2', value: Constants.coefPair },
  { title: 'Full house', x: 'x3', value: Constants.coefFullHouse },
  { title: 'Balut', x: 'x4', value: Constants.coefBalut },
  { title: 'Straight', x: 'x5', value: Constants.coefStraight },
  { title: 'Other', x: 'x0', value: Constants.coefOther }
]

// локальная копия для анимации
const displayDices = ref([...gameStore.dices])
let rollingInterval = null

const rollDices = () => {
  const betNum = Number(bet.value)
  if (!isValidBet(betNum)) return

  // Анимация
  let count = 0
  rollingInterval = setInterval(() => {
    displayDices.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
    count++
    if (count >= 20) {
      clearInterval(rollingInterval)
      displayDices.value = [...gameStore.dices] // итог
    }
  }, 100)

  gameStore.rollDices(betNum).then(() => {
    displayDices.value = [...gameStore.dices]
  })
}

const isValidBet = (val) =>
  Number.isFinite(val) && val > 0 && val <= gameStore.balance

// функция подсветки выигрышной комбинации
const highlightCombo = (combo) => {
  return combo.value === gameStore.currentCombo
    ? 'bg-green-100 text-green-700 font-bold'
    : ''
}
</script>
