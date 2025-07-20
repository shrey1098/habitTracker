<script>
    export let habit;
  </script>
  
  <div class="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-4 mb-4 shadow-sm">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-lg font-bold text-orange-600">{habit.name}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Category: {habit.category}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Current Streak: {habit.streak} 🔥</p>
      </div>
  
      <div class="flex gap-2">
        <button class="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200">
          Check In
        </button>
        <button class="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200">
          😃
        </button>
      </div>
    </div>
  </div>
  