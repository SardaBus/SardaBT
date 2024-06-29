<script>
    import { onMount } from 'svelte';
    import { auth } from '../../stores/auth';
    import { goto } from '$app/navigation';
    import axios from 'axios';

    let username = '';
    let password = '';
    let usertype = 'employee'; // default usertype, you can change this as needed

    async function handleRegister() {
        try {
            await axios.post('http://localhost:3000/api/register', { username, password, usertype });
            await auth.login(username, password);
            goto('./login');
        } catch (err) {
            console.error('Registration error', err);
        }
    }
</script>

<main class="text-center p-20">
    <div class="bg-yellow-200 p-5 flex flex-wrap justify-around rounded-md shadow-sm shadow-black">
        <img src="SardaLogo.png" alt="" class="h-64 drop-shadow-lg hover:drop-shadow-md transition-all">
        <div>
            <h1 class="font-bold text-xl m-4">Register</h1>
            <form on:submit|preventDefault={handleRegister}>
                <input class="p-2 m-2 shadow-md w-64" type="text" placeholder="Username" bind:value={username} required /><br>
                <input class="p-2 m-2 shadow-md w-64" type="password" placeholder="Password" bind:value={password} required /><br>
                <select class="p-2 m-2 shadow-md w-64" bind:value={usertype}>
                    <option value="employee">Employee</option>
                    <option value="driver">Driver</option>
                </select><br>
                <button class="p-2 m-2 shadow-md bg-yellow-400 text-white font-semibold shadow-yellow-800 rounded-sm px-5 hover:px-6 hover:shadow-yellow-800 hover:shadow-sm transition-all" type="submit">Register</button>
            </form>
        </div>
    </div>
    
</main>
