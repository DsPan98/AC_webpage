<template>
    <div id="fullPageHeader">
        <!-- section1, button here, click and ask for current location -->
        <div id="section1">Button for location here
            <button @click="getCurrentLocation">Get your current location</button>
            <div v-if="currentLocation.length > 0">{{ currentLocation }}</div>
        </div>
        <!-- section2, search functions here -->
        <div id=" section2">Search functions here
            <input v-model="searchQuery" @keyup.enter="searchLocation">
            <button @click="searchLocation">Search</button>
        </div>
        <!-- section3 map here, with location and marker of searced location -->
        <div id="section3">Map here
            <div id="map" style="height:300px"></div>
        </div>
        <!-- section4 table here, with all the searched places -->
        <div id="section4">Table here
            <button></button>
            <!-- <v-data-table :headers="headers" :items="places" :items-per-page="10" item-key="id" show-select
                v-model="selected"></v-data-table> -->
            <v-data-table :headers="headers" :items="tableMarkers" :items-per-page="10" show-select
                v-model="selected"></v-data-table>

        </div>
        <!-- section5 time zone here -->
        <div id="section5">Timezone and local time here</div>
    </div>
</template>
<script>
export default {
    name: 'Homepage',
    mounted() {
        this.loadMapScript();
    },
    methods: {
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
            }
            else {
                alert("Geolocation not supported by the browser");
            }
        },
        showPosition(position) {
            alert("Latitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
            this.currentLocation = [position.coords.latitude, position.coords.longitude];

        },
        showError(error) {
            console.log(error);

        },

        searchLocation() {
            return new Promise((resolve, reject) => {

                const apiKey = 'AIzaSyDRVI_zAjaardkVaUlZDmHb6YY_fL_x_UU';
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.searchQuery)}&key=${apiKey}`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        //console.log('Data received in searchLocation:', data);
                        //console.log('Mock fetch data:', JSON.stringify(data, null, 2));

                        if (data.status === 'OK' && data.results.length > 0) {
                            const location = data.results[0].geometry.location;
                            //console.log('location within data:', location);
                            this.addMarker(location.lat, location.lng);
                            this.map.setCenter(location);
                            resolve();
                            //console.log('the markers array size after push is within fetch:', this.markers.length)

                        } else {
                            console.error('No results found');
                            reject(new Error('No results found'));
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        reject(error);
                    });
            });
        },

        initMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                center: { lat: -34.397, lng: 150.644 }, // Default center
            });
            // Store map instance in Vue data for later use
            this.map = map;
        },
        addMarker(lat, lng) {
            console.log(`Adding marker at lat: ${lat}, lng: ${lng}`); // Debug output
            const marker = new google.maps.Marker({
                position: { lat, lng },
                map: this.map,
            });
            if (marker) {
                //console.log('Marker created successfully', marker);
                this.markers.push(marker);
                /*
                console.log('the markers array size after push is:', this.markers.length)
                console.log('Marker pushed to markers array', this.markers);
                console.log('Markers being pushed to array, first element would be:', this.markers[0].position)
                */
            } else {
                console.error('Failed to create marker');
            }
        },
        loadMapScript() {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDRVI_zAjaardkVaUlZDmHb6YY_fL_x_UU&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = this.initMap.bind(this);
            document.head.appendChild(script);
        },
        tableDelete() {
            this.places = this.places.filter(place => !this.selected.includes(place.id));
            this.selected = [];


        }
    },
    computed: {
        tableMarkers() {
            return this.markers.map(marker => {
                return {
                    lat: marker.position.lat(),
                    lng: marker.position.lng()
                };
            });
        }
    },


    data() {
        return {
            currentLocation: [],
            map: null,
            markers: [],
            searchQuery: '',

            headers: [
                { text: 'Latitude', value: 'lat' },
                { text: 'Longitude', value: 'lng' }
            ],
            // headers: [
            //     { text: 'Name', value: 'name' },
            //     { text: 'Address', value: 'address' },
            //     { text: 'Coordinates', value: 'coords' },
            // ],
            selected: [],
            places: [],
        };
    }
}

</script>
<style>
#fullPageHeader {
    border: 2px solid red;
    width: 100vw;
    height: 500px;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    margin: auto;
}
</style>