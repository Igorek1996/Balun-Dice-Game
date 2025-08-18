<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gray-100">
    <!-- Левая панель -->
    <LeftPanel />

    <!-- Правая панель -->
    <div class="flex-1 p-4 ">
      <!-- Переключатели -->
      <div class="mb-4 flex gap-2">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          class="px-4 py-2 rounded-md font-medium transition-colors duration-200" :class="[
            activeTab === tab
              ? 'cursor-pointer bg-green-500 text-white ring-2 ring-green-300'
              : 'cursor-pointer bg-green-100 text-green-700 hover:bg-green-200'
          ]">
          {{ tab }}
        </button>
      </div>

      <!-- Контент -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <ChartDisplay v-show="activeTab === 'Chart'" />
        <ResultDisplay v-show="activeTab === 'Result'" />
      </div>
    </div>
  </div>
</template>

<script setup>
const tabs = ['Chart', 'Result']
const activeTab = ref('Result')
</script>
