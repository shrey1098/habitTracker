<script>
    export let longestStreak = 0;
    export let successRate = 0;
    export let habitsCompleted = 0;
    export let totalHabits = 0;
  </script>
  
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div class="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-xl p-4 shadow">
      <p class="text-sm font-semibold">Longest Streak</p>
      <p class="text-2xl font-bold">{longestStreak} 🔥</p>
    </div>
    <div class="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-xl p-4 shadow">
      <p class="text-sm font-semibold">Success Rate</p>
      <p class="text-2xl font-bold">{successRate}% 📈</p>
    </div>
    <div class="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-xl p-4 shadow">
      <p class="text-sm font-semibold">Completed Today</p>
      <p class="text-2xl font-bold">{habitsCompleted} ✅</p>
    </div>
    <div class="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-xl p-4 shadow">
      <p class="text-sm font-semibold">Total Habits</p>
      <p class="text-2xl font-bold">{totalHabits} 🎯</p>
    </div>
  </div>
  