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

  const allUserWins = ref(0) // общая сумма выигрышей
  const allUserBets = ref(0) // общая сумма ставок

  const WIN_MULTIPLIERS = {
    [Constants.coefPair]: 1.94,
    [Constants.coefFullHouse]: 2.94,
    [Constants.coefBalut]: 3.95,
    [Constants.coefStraight]: 4.95,
    [Constants.coefOther]: 0
  }

  const generateDices = () => {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1)
  }

  // Бросок в реальной игре — обновляет dices.value
  const getDices = () => {
    dices.value = generateDices()
    return dices.value
  }

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
    const win = (bet * multiplier) - bet
    setBalance(win)
    return { combo: currentCombo.value, win }
  }

  const rollDices = async (bet) => {
    setBalance(-bet)
    isDiceRolling.value = true

    await new Promise(resolve => setTimeout(resolve, 2000))

    const currentResult = getDices()
    const { combo, win } = calculateRoll(currentResult, bet)

    allUserBets.value += bet
    allUserWins.value += win
    console.log(win);

    history.value.push({
      results: currentResult,
      bet,
      win,
      combo
    })

    isDiceRolling.value = false
  }

  const simulateRolls = (count = 10000, bet = 10) => {
    let totalBets = 0
    let totalWins = 0

    for (let i = 0; i < count; i++) {
      const currentResult = generateDices()
      const { combo, win } = calculateRoll(currentResult, bet)

      totalBets += bet
      totalWins += win

      history.value.push({
        results: currentResult,
        bet,
        win,
        combo
      })
    }

    // Обновляем суммарные данные
    allUserBets.value += totalBets
    allUserWins.value += totalWins
  }


  const getRTP = () => {
    if (allUserBets.value === 0) return 0
    return (allUserWins.value / allUserBets.value) * 100
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
    allUserBets,
    simulateRolls
  }
})
