

<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';

    onMount(() => {
        auth.checkAuth();
    })
</script>

<main class="text-center">
    <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5 mt-10" on:click={() => {
        window.location.href="./register";
    }}>Register New User</button><br>
    <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5 mt-10" on:click={() => {
        window.location.href="./employee";
    }}>Go to Employee Page</button>

</main>