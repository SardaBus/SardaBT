<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    onMount(() => {
        auth.checkAuth();
    });
</script>

<main>
    <div class="m-2 h-96 w-100 bg-yellow-200">
        Map
    </div>
    <center><button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5">Start Journey</button></center>
</main>