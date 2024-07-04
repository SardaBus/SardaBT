<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    
    let intervalId;
    let isJourneyActive = true;

    onMount(() => {
        const map = new mappls.Map('map', {center:{lat:17.822122987416197,lng:83.20505999018316} });
        auth.checkAuth();
        intervalId = setInterval(fetchBusLocations , 10000);
    });

    function fetchBusLocations(){
        if (isJourneyActive){
            fetch('http://localhost:3000/api/locations')
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        }
    }

    function stopJourney(){
        isJourneyActive = false;
        clearInterval(intervalId);
        console.log('Journey stopped.');
    }

</script>

<main>
    <div class="m-2 h-96 w-100 bg-yellow-200">
        <div id="map" class="h-full"></div>
    </div>
    <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5" on:click={stopJourney}>Stop Journey</button>
</main>