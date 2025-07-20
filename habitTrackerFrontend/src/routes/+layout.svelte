<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { checkAuth, isLoggedIn } from '$lib/auth.js';
	import { user } from '../../src/stores/user.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { Toaster } from 'svelte-sonner';

  
	// Track loading state while checking auth
	const loading = writable(true);
  
	// List of routes that require login
	const protectedRoutes = ['/dashboard', '/habits', '/profile'];
  
	onMount(async () => {
	  await checkAuth(); // calls /auth/verify
	  const tokenExists = isLoggedIn();
  
	  const currentPath = $page.url.pathname;
  
	  if (!tokenExists && protectedRoutes.includes(currentPath)) {
		goto('/login');
	  }
  
	  loading.set(false); // done checking
	});
  </script>
  
  {#if $loading}
	<div class="flex h-screen items-center justify-center bg-gray-100">
	  <p class="text-lg font-semibold text-gray-600">Loading...</p>
	</div>
  {:else}
		<!-- Usually in layout or App.svelte -->
		<Toaster position="bottom-center" richColors/>
	<slot />
  {/if}