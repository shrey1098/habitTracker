<script lang="ts">
	import Dialog from '../../src/components/Dialog.svelte'; // Adjust the path based on the actual location of Dialog.svelte
	import Input from '../../src/components/ui/Input.svelte';
	import Button from '../../src/components/ui/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { addHabit } from '$lib/api.js';

	export let open: boolean = false;

	let name = '';
	let why = '';
	let category = '';
	let error = '';

	const categoryOptions = [
		'Fitness',
		'Gratitude',
		'Mind',
		'Family',
		'Professional',
		'Health',
		'Looks',
		'Other'
	];

	const dispatch = createEventDispatcher();

	function handleClose() {
		console.log('Closing dialog');
		dispatch('close');
	}

	async function submitHabit() {
		if (!name || !why || !category) {
			error = 'All fields are required.';
			return;
		}

		try {
			const res = await addHabit({ name, why, category });
			dispatch('add', res); // optional: send the new habit back to the parent
			// Reset form
			name = '';
			why = '';
			category = '';
			error = '';
			handleClose(); // Close the dialog
		} catch (err) {
			console.error('Failed to add habit:', err);
			error = 'Failed to add habit. Please try again.';
		}
	}
</script>

<!-- Dialog component -->
<Dialog {open}>
	<svelte:fragment slot="header">
		<h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-white">Add New Habit</h2>
	</svelte:fragment>

	<svelte:fragment slot="content">
		{#if error}
			<p class="mb-2 text-sm text-red-500">{error}</p>
		{/if}

		<div class="space-y-4">
			<div>
				<label
					for="habitName"
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label
				>
				<Input id="habitName" bind:value={name} placeholder="e.g. Morning Run" />
			</div>

			<div>
				<label
					for="habitWhy"
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Why</label
				>
				<Input id="habitWhy" bind:value={why} placeholder="e.g. Build consistency" />
			</div>

			<div>
				<label
					for="habitCategory"
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label
				>
				<select
					id="habitCategory"
					bind:value={category}
					class="w-full rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
				>
					<option value="" disabled selected>Select category</option>
					{#each categoryOptions as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<Button onClick={submitHabit} class="">Add Habit</Button>
		<Button onClick={handleClose} class="">Close</Button>
	</svelte:fragment>
</Dialog>
