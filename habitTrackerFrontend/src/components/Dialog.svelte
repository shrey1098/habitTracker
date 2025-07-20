<!-- src/components/ui/dialog.svelte -->
<script>
	import {createEventDispatcher} from 'svelte';

	export let open = false;
	let dispatch = createEventDispatcher();
	function onClose () {
		console.log('Closing dialog');
		dispatch('close');
	}
  </script>
  
  {#if open}
	<button class="fixed inset-0 bg-black bg-opacity-40 z-40" on:click={onClose} aria-label="Close dialog" type="button">xyz</button>
	<div class="fixed inset-0 z-50 flex items-center justify-center">
	  <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg w-full max-w-md">
		   <!-- Top-right close "X" -->
		   
		<slot name="header" />
		<slot name="content" />
		<slot name="footer" />
	  </div>
	</div>
  {/if}