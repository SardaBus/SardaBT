

<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    
    let intervalId;
    let isJourneyActive = true;
    let marker;
    let adminBusId = "NAD";

    onMount(() => {
        auth.checkAuth();
        if($auth.usertype == "driver") {
            window.location.href = "./Unauthorized";
        }
        setTimeout(() => {
            const map = new mappls.Map('map', {center:{lat:17.822122987416197,lng:83.20505999018316} });
            const busIcon = '/BusMarker.png'; // Path to the icon in the static directory

            marker = new mappls.Marker({
                map: map,
                position: { lat: 17.822122987416197, lng: 83.20505999018316 },
                icon: busIcon,
                offset: [0, 10],
                width: 70,
                height: 70,
                popupOptions: true,
                popupHtml: 'Sarda Bus'
            });
        }, 500);

        intervalId = setInterval(fetchBusLocations , 10000);
    });

    function fetchBusLocations(){
        if (isJourneyActive){
            fetch('https://sardabackend.onrender.com/api/locations')
            .then(response => response.json())
            .then(data => {
                if ($auth.busPreference == "both") {
                    console.log(data);
                    marker.setPosition({"lat":data[adminBusId].lat,"lng":data[adminBusId].lng});
                }
                else {
                    console.log(data);
                    marker.setPosition({"lat":data[$auth.busPreference].lat,"lng":data[$auth.busPreference].lng});
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function stopJourney(){
        isJourneyActive = false;
        clearInterval(intervalId);
        console.log('Journey stopped.');
    }

</script>

<main class="text-center">
    <div class="m-2 h-96 w-100 bg-yellow-200">
        <div id="map" class="h-full"></div>
    </div>
    {#if $auth.busPreference == 'both'}
    <select class="p-2 m-2 shadow-md w-64" bind:value={adminBusId}>
        <option value="NAD">NAD</option>
        <option value="SN">SN</option>
    </select><br>
    {/if}
    <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5" on:click={stopJourney}>Stop Journey</button>
</main>