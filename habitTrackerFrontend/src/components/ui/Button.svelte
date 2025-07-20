<script>
    export let onClick;
    export let type = "button";
    export let className = "";
    export let disabled = false;
  </script>
  
  <button
    type={type}
    on:click={onClick}
    class={`px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none disabled:opacity-50 ${className}`}
    disabled={disabled}
  >
    <slot />
  </button>
  