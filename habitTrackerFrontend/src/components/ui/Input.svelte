<script>
    export let type = "text";
    export let placeholder = "";
    export let value = "";
    export let name = "";
    export let id = "";
    export let required = false;
    export let onInput;
  </script>
  
  <input
    id={id}
    name={name}
    type={type}
    bind:value
    placeholder={placeholder}
    required={required}
    on:input={onInput}
    class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
  />
  