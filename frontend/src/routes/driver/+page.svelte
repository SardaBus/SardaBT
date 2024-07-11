<script>
    import { auth } from '../../stores/auth';
    import { onMount } from 'svelte';
    
    
    let isTracking = false;
    let busId = '';
    let watchId;

    onMount(() => {
        auth.checkAuth();
        if($auth.usertype == "employee") {
            window.location.href = "./Unauthorized";
        }
        busId = $auth.busPreference;
        setTimeout(() => {
          const map = new mappls.Map('map', {center:{lat:17.822122987416197,lng:83.20505999018316} });
        }, 500);
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
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
    }

    function trackLocation() {
        if (navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(position => {
            if (isTracking) {
              const { latitude, longitude } = position.coords;
              const response = fetch('https://sardabackend.onrender.com/api/location', {
                method:'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id:busId, lat:latitude, lng:longitude }),
              }).then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
            }
          }, error => {
            console.error(error);
          }, {
            enableHighAccuracy: true,
            maximumAge: 0
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