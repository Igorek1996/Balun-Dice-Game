import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useConstants } from '#imports'

export const useGameStore = defineStore('game', () => {
  const Constants = useConstants()

  const dices = ref([null, null, null, null, null])
  const currentCombo = ref("")
  const isDiceRolling = ref(false)
  const balance = ref(100)
  const history = ref([])

  const allUserWins = ref(0) // количество побед
  const allUserBets = ref(0) // сумма всех ставок

  const WIN_MULTIPLIERS = {
    [Constants.coefPair]: 2,
    [Constants.coefFullHouse]: 3,
    [Constants.coefBalut]: 4,
    [Constants.coefStraight]: 5,
    [Constants.coefOther]: 0
  }

  const getDices = () =>
    dices.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)

  const setBalance = (num) => balance.value += num

  const getCombo = (dice) => {
    const counts = {}
    dice.forEach(v => counts[v] = (counts[v] || 0) + 1)
    const values = Object.values(counts).sort((a, b) => b - a)

    if (values[0] === 5) return Constants.coefBalut
    if (values[0] === 3 && values[1] === 2) return Constants.coefFullHouse

    const sorted = [...new Set(dice)].sort((a, b) => a - b).join("")
    if (sorted === "12345" || sorted === "23456") return Constants.coefStraight

    if (values[0] >= 2) return Constants.coefPair
    return Constants.coefOther
  }

  const calculateRoll = (arr, bet) => {
    currentCombo.value = getCombo(arr)
    const multiplier = WIN_MULTIPLIERS[currentCombo.value] || 0
    const win = bet * multiplier
    setBalance(win)
    return { combo: currentCombo.value, win: win - bet }
  }

  const rollDices = async (bet) => {
    setBalance(-bet)
    isDiceRolling.value = true

    await new Promise(resolve => setTimeout(resolve, 2000))

    const currentResult = getDices()
    const { combo, win } = calculateRoll(currentResult, bet)

    // сумма всех ставок
    allUserBets.value += bet

    // количество побед
    if (win > 0) {
      allUserWins.value += 1
    }

    // добавляем в историю
    history.value.push({
      results: currentResult,
      bet,
      win,
      combo
    })

    isDiceRolling.value = false
  }

  const getRTP = () => {
    if (history.value.length === 0) return 0
    return (allUserWins.value / history.value.length) * 100
  }

  return {
    dices,
    balance,
    isDiceRolling,
    currentCombo,
    history,
    rollDices,
    getRTP,
    allUserWins,
    allUserBets
  }
})
