<script>
    export let habit;
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    let showMoodPicker = false;

    function handleCheckIn(){
      //console.log({'msg':habit._id});
      dispatch('checkin', {id: habit._id});
    }

    function toggleMoodPicker(){
      showMoodPicker = !showMoodPicker;
    }

    function selectMood(mood){
      dispatch('LogMood', {id: habit._id, mood: mood});
      showMoodPicker = !showMoodPicker;
    }

</script>

  <div class="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl p-4 mb-4 shadow-sm">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-lg font-bold text-orange-600">{habit.name}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Category: {habit.category}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Current Streak: {habit.streak} 🔥</p>
      </div>

      <div class="flex gap-2">
        <button class="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200"
        on:click={handleCheckIn}
        >
          Check In
        </button>
        <button
          class="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200"
          on:click={toggleMoodPicker}
        >
          😃
        </button>

        {#if showMoodPicker}
          <div class="absolute bg-white dark:bg-gray-800 border rounded-lg shadow-md z-10 px-2 py-1 flex gap-2">
            <button on:click={() => selectMood('😊')} class="text-xl hover:scale-110">😊</button>
            <button on:click={() => selectMood('😐')} class="text-xl hover:scale-110">😐</button>
            <button on:click={() => selectMood('😔')} class="text-xl hover:scale-110">😔</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
