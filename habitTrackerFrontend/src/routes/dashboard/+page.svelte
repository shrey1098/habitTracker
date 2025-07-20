<script>
	import { onMount } from 'svelte';
	import { user } from '../../stores/user.js';
	import { getHabits, checkHabit, logMood } from '$lib/api.js';
  import {goto} from '$app/navigation';
	import { toast } from 'svelte-sonner';

	// import components
	import HabitCard from '../../components/HabitCard.svelte';
	import FloatingButton from '../../components/FloatingButton.svelte';
	import DashboardSummary from '../../components/DashboardSummary.svelte';
	import AddHabitDialog from '../../components/AddHabitDialog.svelte';
	
	/**
	 * @type {any[]}
	 */
	let habits = [];
	let loading = true;
	let showAddHabitDialog = false;

	onMount(async () => {
		try {
			const data = await getHabits();
			//console.log('Habits loaded:', data);
			habits = data || [];
		} catch (err) {
			//console.error('Error loading habits:', err);
		} finally {
			loading = false;
		}
	});

	const openDialog = () => {
		//console.log('Opening add habit dialog');
		showAddHabitDialog = true;
	};

	/**
	 * @param {{ detail: { name: any; category: any; }; }} event
	 */
	function handleAddHabitSubmit(event){
		const {name, category} = event.detail;
		//console.log('New Habit:', name, category);
		// Here you would typically call an API to save the new habit
	}

	async function handleCheckIn(habitId){

		//console.log('Check In:', habitId);
		try {
			const result = await checkHabit(habitId);
			console.log(result);
			if (result && result.success) {
				// re-fetch habits to display updated strek
				const updated = await getHabits();
				habits = updated || [];
			}
		} catch (err) {
			if (err.message.includes("Habit already checked for today")) {
				toast.error("⛔ You can only check in once per day.");
			} else {
				toast.error("❌ Something went wrong. Try again.");
			}
		}
	}

	async function handleLogMood(habitId, mood) {
		try {
			const result = await logMood(habitId, mood);
			if (result.message === 'Reaction added successfully') {
				toast.success("📝 Mood logged!");
				const updated = await getHabits();
				habits = updated || [];
			} else {
				toast.error("Failed to log mood.");
			}
		} catch (err) {
			toast.error("❌ Something went wrong.");
			console.error(err);
		}
	}
</script>

{#if loading}
	<p class="mt-6 text-center text-gray-400">Loading dashboard...</p>
{:else}
	<div class="mx-auto max-w-3xl px-4 py-6">
		<h1 class="mb-4 text-2xl font-semibold text-orange-500">Hi, {$user.email} 👋</h1>
		<h2 class="mb-3 text-lg font-medium text-gray-700 dark:text-gray-200">Today's Habits</h2>

		<!-- Summary card above habits list -->
		<DashboardSummary
			longestStreak={Math.max(...habits.map((h) => h.streak), 0)}
			successRate={Math.round(
				habits.length
					? (habits.filter((h) => h.lastCheckInDate === new Date().toISOString().split('T')[0])
							.length /
							habits.length) *
							100
					: 0
			)}
			habitsCompleted={habits.filter(
				(h) => h.lastCheckInDate === new Date().toISOString().split('T')[0]
			).length}
			totalHabits={habits.length}
		/>
		{#if habits.length === 0}
			<div class="mt-8 text-center text-gray-500 dark:text-gray-400">
				<p class="text-lg">No habits yet.</p>
				<p class="text-sm">
					Click the <span class="text-xl font-bold text-orange-500">+</span> button below to add your
					first habit!
				</p>
			</div>
		{:else}
			{#each habits as habit}
				<HabitCard {habit}
									 on:checkin={(e) => handleCheckIn(e.detail.id)}
									 on:LogMood={(e) => handleLogMood(e.detail.id, e.detail.mood)
				}
				/>
			{/each}
		{/if}
	</div>
	<FloatingButton onClick={openDialog}>
		<span class="text-2xl font-bold">+</span>
		
	</FloatingButton>
	<!-- <AddHabitDialog /> -->
	{#if showAddHabitDialog}
		<AddHabitDialog 
		open={showAddHabitDialog} 
		on:close={() => showAddHabitDialog = false} 
		on:add={(e)=> habits = [...habits, e.detail]}
		/>
	{/if}

{/if}
