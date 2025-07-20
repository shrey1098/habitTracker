<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import { isLoggedIn} from '$lib/auth.js';
  import {loginUser} from '$lib/api.js';
  import { user } from '../../stores/user.js';

  let email = "";
  let password = "";

  onMount(() => {
    if (isLoggedIn()) {
      goto('/'); // If already logged in, redirect
    }
  });

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });

      if (res && res.token) {
        localStorage.setItem('token', res.token);
        user.set(res.user); // Save user to store
        goto('/'); // Redirect to dashboard/home
      } else {
        alert('Login failed: ' + res?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. See console for details.');
    }
  };
</script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      
      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <input
          type="email"
          bind:value={email}
          placeholder="Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        
        <input
          type="password"
          bind:value={password}
          placeholder="Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
  
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>


