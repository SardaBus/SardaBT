<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';

    let username = "";
    let password = "";

    onMount(() => {
        auth.checkAuth();
        if ($auth.user)
        {
            if ($auth.usertype=="employee")
            {
                window.location.href="./employee";
            }
            else if ($auth.usertype=="driver")
            {
                window.location.href="./driver";
            }
        }
    });

    async function handleLogin() {
        await auth.login(username, password);
        if ($auth.usertype=="employee")
            window.location.href="./employee";
        else if ($auth.usertype=="driver")
            window.location.href="./driver";
    }
</script>
<main class="text-center p-20 md:p-12 sm:p-12">
    <div class="bg-yellow-200 p-5 flex flex-wrap justify-around rounded-md shadow-sm shadow-black">
        <img src="SardaLogo.png" alt="" class="h-60 drop-shadow-lg hover:drop-shadow-md transition-all">
        <div>
            <h1 class="font-bold text-xl m-4">Login</h1>
            <form on:submit|preventDefault={handleLogin} class="">
                <input  class="p-2 m-2 shadow-md w-64" type="text" placeholder="Username" bind:value={username} required /><br>
                <input  class="p-2 m-2 shadow-md w-64" type="password" placeholder="Password" bind:value={password} required /><br>
                <button class="p-2 m-2 shadow-md bg-yellow-400 text-white font-semibold shadow-yellow-800 rounded-sm px-5 hover:px-6 hover:shadow-yellow-800 hover:shadow-sm transition-all" type="submit">Login</button>
            </form>
        </div>
        
    </div>
</main>