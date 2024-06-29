<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    import MyMapIndia from '../../lib/components/MyMapIndia.svelte';
    onMount(() => {
        auth.checkAuth();
    });
</script>

<main>
    <div class="m-2 h-96 w-100 bg-yellow-200">
        <MyMapIndia />
    </div>
</main>