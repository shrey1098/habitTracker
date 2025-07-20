<script lang="ts">
  export let onClick: () => void = () => {};
  export let label: string = "";
</script>

<div class="fixed bottom-6 right-6 z-50 group">
  <button
    class="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 focus:outline-none transition duration-200"
    on:click={onClick}
    aria-label={label}
  >
    <slot />
  </button>

  {#if label}
    <div class="absolute right-16 bottom-1/2 transform translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-gray-800 text-white px-3 py-1 rounded shadow-md whitespace-nowrap">
      {label}
    </div>
  {/if}
</div>
