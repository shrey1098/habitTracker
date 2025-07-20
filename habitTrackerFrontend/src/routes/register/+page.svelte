<script>
    import {registerUser} from "$lib/api.js";
    import {goto} from "$app/navigation";
	import { user } from "../../stores/user.js";
    import { isLoggedIn } from "$lib/auth.js";
    import { onMount } from "svelte";

    onMount(() => {
    if (isLoggedIn()) {
      goto('/'); // If already logged in, redirect
    }
  });

    let name = "";
    let email = "";
    let password = "";
    let loading = false;
    let error = "";

    async function handleRegister(e) {
        e.preventDefault();
        loading = true;
        error = "";

        try {
            const res = await registerUser({ name, email, password });
            if (res.token) {
                // Store token in local storage or state management
                localStorage.setItem('token', res.token);
                user.set(res.user); // Assuming the response contains user data
                // Redirect to the home page or dashboard
                goto('/');
            } else {
                error = res.message || "Registration failed. Please try again.";
            } // Closing brace added here
        } catch (err) {
            error = (err instanceof Error ? err.message : "An error occurred during registration.");
        } finally {
            loading = false;
        }
    }


</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-4">Register!</h1>

    {#if error}
        <p class="text-red-500 mb-2">{error}</p>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
        <label class="block mb-2">
            <span>Name</span>
            <input class="w-full border p-2 rounded" bind:value={name} required />
        </label>

        <label class="block mb-2">
            <span>Email</span>
            <input type="email" class="w-full border p-2 rounded" bind:value={email} required />
        </label>

        <label class="block mb-4">
            <span>Password</span>
            <input type="password" class="w-full border p-2 rounded" bind:value={password} required />
        </label>

        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
            {#if loading}
                Registering...
            {:else}
                Register
            {/if}
        </button>

    </form>
</div>