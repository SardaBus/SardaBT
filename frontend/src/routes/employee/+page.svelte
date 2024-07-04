<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    
    onMount(() => {
        const map = new mappls.Map('map', {center:{lat:17.822122987416197,lng:83.20505999018316} });
        auth.checkAuth();
        setInterval(function() {fetch('http://localhost:3000/api/locations').then(response => response.json())
                                                    .then(data => console.log(data))}, 10000)
    });

    
</script>

<main>
    <div class="m-2 h-96 w-100 bg-yellow-200">
        <div id="map" class="h-full"></div>
    </div>
</main>