<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    
    
    let isTracking = false;
    let busId = '';
    let watchId;
    let intervalId;

    onMount(() => {
        auth.checkAuth();
        if($auth.usertype == "employee") {
            window.location.href = "./Unauthorized";
        }
        busId = $auth.busPreference;
        const map = new mappls.Map('map', {center:{lat:17.822122987416197,lng:83.20505999018316} });
    });

    function startTracking() {
        if (!busId) {
          alert('Please enter a bus ID');
          return;
        }

        isTracking = true;
        trackLocation();
    }

    function stopTracking() {
        isTracking = false;
        clearInterval(intervalId);
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
        console.log("Tracking stopped.")
    }

    function trackLocation() {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            if (isTracking) {
                // Clear any previous interval to avoid multiple intervals running
                clearInterval(intervalId);

                intervalId = setInterval(() => {
                    fetch('https://sardabackend.onrender.com/api/location', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: busId, lat: latitude, lng: longitude }),
                    })
                    .then(response => response.json())
                    .then(data => console.log(data, { id: busId, lat: latitude, lng: longitude }))
                    .catch(error => console.error('Error:', error));
                }, 5000); // send location every 5 seconds
            }
        }, error => {
            console.error(error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
    }
</script>

<main>
    <div class="m-2 h-96 w-100 bg-yellow-200">
        <div id="map" class="h-full"></div>
    </div>
    <center>
        <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5" on:click={startTracking} disabled={isTracking}>Start Journey</button>
        <button class="bg-yellow-500 hover:bg-yellow-800 font-semibold hover:text-white shadow-black shadow-md py-3 px-5" on:click={stopTracking} disabled={!isTracking}>Stop Journey</button>
    </center>
</main>