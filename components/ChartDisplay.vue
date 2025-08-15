<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Win History Chart</h2>
    <canvas ref="chartCanvas" class="w-full h-64"></canvas>
  </div>
</template>

<script setup>
import { useGameStore } from '@/store/gameStore'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const gameStore = useGameStore()
const chartCanvas = ref(null)
let chartInstance = null

// Функция для обновления графика
const updateChart = () => {
  if (!chartInstance) return

  const labels = gameStore.history.map((_, i) => i + 1)
  const data = gameStore.history.map(item => item.win)

  chartInstance.data.labels = labels
  chartInstance.data.datasets[0].data = data
  chartInstance.update()
}

// Инициализация графика при монтировании
onMounted(() => {
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: gameStore.history.map((_, i) => i + 1),
      datasets: [
        {
          label: 'Win Amount',
          data: gameStore.history.map(item => item.win),
          backgroundColor: 'rgba(34,197,94,0.2)',
          borderColor: 'rgba(34,197,94,1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Roll #'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Win'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Win: ${context.raw}`
            }
          }
        }
      }
    }
  })
})

// Следим за изменениями истории, чтобы обновлять график
watch(() => gameStore.history.length, () => {
  updateChart()
})
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 16rem !important;
}
</style>
