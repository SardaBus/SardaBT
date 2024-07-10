<script>
    import { onMount } from 'svelte';
    import { auth } from '../../stores/auth';
    import { goto } from '$app/navigation';
    import axios from 'axios';

    let username = '';
    let password = '';
    let usertype = 'employee'; // default usertype, you can change this as needed
    let busPreference = 'SN';
    let showPassword = false;

    onMount(() => {
        auth.checkAuth();
        if($auth.usertype != "admin") {
            window.location.href = "./Unauthorized";
        }
    })

    async function handleRegister() {
        try {
            await axios.post('http://localhost:3000/api/register', { username, password, usertype, busPreference });
            await auth.login(username, password);
            goto('./login');
        } catch (err) {
            console.error('Registration error', err);
        }
    }

    function togglePasswordVisibility(){
        showPassword = !showPassword;
    }
</script>

<main class="text-center p-20">
    <div class="bg-yellow-200 p-5 flex flex-wrap justify-around rounded-md shadow-sm shadow-black">
        <img src="SardaLogo.png" alt="" class="lg:h-48 h-40 lg:mt-14 drop-shadow-lg hover:drop-shadow-md transition-all">
        <div>
            <h1 class="font-bold text-xl m-4">Register</h1>
            <form on:submit|preventDefault={handleRegister}>
                <input class="p-2 m-2 shadow-md w-64" type="text" placeholder="Username" bind:value={username} required /><br>
                <div class="relative inline-block w-64">
                    {#if showPassword}
                        <input  class="p-2 shadow-md w-full" type="text" placeholder="Password" bind:value={password} required />
                    {:else}
                        <input  class="p-2 shadow-md w-full" type="password" placeholder="Password" bind:value={password} required />
                    {/if}
                    <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" on:click={togglePasswordVisibility}>
                        {#if showPassword}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                          
                        {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                          
                        {/if}
                    </button>
                </div><br>
                <select class="p-2 m-2 shadow-md w-64" bind:value={usertype}>
                    <option value="employee">Employee</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                </select><br>
                <select class="p-2 m-2 shadow-md w-64" bind:value={busPreference}>
                    <option value="NAD">NAD</option>
                    <option value="SN">Sujatha Nagar</option>
                    <option value="both">Both</option>
                </select><br>
                <button class="p-2 m-2 shadow-md bg-yellow-400 text-white font-semibold shadow-yellow-800 rounded-sm px-5 hover:px-6 hover:shadow-yellow-800 hover:shadow-sm transition-all" type="submit">Register</button>
            </form>
        </div>
    </div>
    
</main>
