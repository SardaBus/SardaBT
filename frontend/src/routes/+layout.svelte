<script>
    import "../app.css";
    import { auth } from "../stores/auth";
    
</script>

<header class="bg-yellow-200 mt-2 p-5 flex flex-wrap gap-4 shadow-sm shadow-black justify-between">
    <div class="flex flex-wrap gap-4">
        <img src="SardaLogo.png" alt="Logo" class="h-12 drop-shadow-md">
        <h1 class="text-3xl font-semibold drop-shadow-md">Bus Tracker</h1>
    </div>
    <nav class="p-3">
        <a class="bg-yellow-400 font-semibold text-white p-2 shadow-md hover:shadow-sm transition-all rounded-sm" href="/">Home</a>
        {#if $auth.user}
            <button class="bg-yellow-400 font-semibold text-white p-2 shadow-md hover:shadow-sm transition-all rounded-sm" on:click={() => {
                auth.logout();
                window.location.href="./login";
            }}>Logout</button>
        {:else}
            <a class="bg-yellow-400 font-semibold text-white p-2 shadow-md hover:shadow-sm transition-all rounded-sm" href="/login">Login</a>
            <a class="bg-yellow-400 font-semibold text-white p-2 shadow-md hover:shadow-sm transition-all rounded-sm" href="/register">Register</a>
        {/if}
    </nav>
</header>


<slot />