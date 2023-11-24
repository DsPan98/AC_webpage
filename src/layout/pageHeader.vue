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
        <div id="section4" style="width:90%; align-self:center; margin:auto; border:2px solid red;">Table here
            <button @click="deleteSelected">button for deletion</button>
            <v-data-table :headers="headers" :items="places" :items-per-page="10" item-key="id" show-select
                v-model="selected"></v-data-table>
            <!-- <v-data-table :headers="headers" :items="tableMarkers" :items-per-page="10" show-select
                v-model="selected"></v-data-table> -->

        </div>
        <!-- section5 time zone here -->
        <div id="section5">
            Timezone and local time here:
            <div v-if="latestTimezone">Time Zone: {{ latestTimezone }}</div>
            <div v-if="localTime">Local Time: {{ localTime }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Homepage',
    mounted() {
        this.loadMapScript();
        this.loadTestItems();
        setInterval(this.updateLocalTime, 1000);
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
            // this.currentLocation = [position.coords.latitude, position.coords.longitude];
            // this.addMarker(position.coords.latitude, position.coords.longitude);
            // this.addPlace(this.markers[this.markers.length - 1], 'Current Location', 'test address');
            this.showAddress(position.coords.latitude, position.coords.longitude);

        },
        showError(error) {
            console.log(error);

        },

        searchLocation() {
            return new Promise((resolve, reject) => {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.searchQuery)}&key=${this.getApiKey()}`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        //console.log('Data received in searchLocation:', data);
                        //console.log('Mock fetch data:', JSON.stringify(data, null, 2));

                        if (data.status === 'OK' && data.results.length > 0) {
                            const location = data.results[0].geometry.location;
                            const name = this.searchQuery;
                            const address = data.results[0].formatted_address;
                            //console.log('location within data:', location);
                            this.addMarker(location.lat, location.lng);
                            this.addPlace(this.markers[this.markers.length - 1], name, address);
                            this.map.setCenter(location);
                            this.getTimeZone(location.lat, location.lng);
                            resolve();
                            //console.log('the markers array size after push is within fetch:', this.markers.length)

                        } else {
                            console.error('No results found');
                            reject(new Error('No results found'));
                            alert('We could not find the location you typed in.');
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
                //add coord to places as well

            } else {
                console.error('Failed to create marker');
            }
        },
        loadMapScript() {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?&key=${this.getApiKey()}&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = this.initMap.bind(this);
            document.head.appendChild(script);
        },
        deleteSelected() {
            this.places = this.places.filter(place => !this.selected.includes(place.id));
            this.selected = [];
        },
        addPlace(marker, searchQuery, address) {
            const newPlace = {
                id: this.generateUniqueId(),
                name: searchQuery,
                address: address,
                coords: `${marker.position.lat()}, ${marker.position.lng()}`,

            };

            this.places.push(newPlace);
        },


        //helper function, generating unique id for places array
        generateUniqueId() {
            //random generating
            return Date.now() + Math.random().toString(36).substring(2, 9);
        },

        //method created to load places array with test items, comment out later
        loadTestItems() {
            this.places = [
                {
                    id: -1,
                    name: 'Some place 1',
                    address: 'add for someplace 1',
                    coords: '-1.5, 1.5',
                },
                {
                    id: -2,
                    name: 'Some place 2',
                    address: 'add for someplace 2',
                    coords: '-3.5, 3.5',
                },
                {
                    id: -3,
                    name: 'Some place 3',
                    address: 'add for someplace 3',
                    coords: '-132.5, 31.5',
                },
                {
                    id: -4,
                    name: 'MCGILL UNIVERSITY',
                    address: '845 Rue Sherbrooke O, Montréal, QC H3A 0G4, Canada',
                    coords: '45.50478469999999, -73.5771511',
                },
                { id: -5, name: 'Place 5', address: 'Address 5', coords: '20.5, -20.5' },
                { id: -6, name: 'Place 6', address: 'Address 6', coords: '21.5, -21.5' },
                { id: -7, name: 'Place 7', address: 'Address 7', coords: '22.5, -22.5' },
                { id: -8, name: 'Place 8', address: 'Address 8', coords: '23.5, -23.5' },
                { id: -9, name: 'Place 9', address: 'Address 9', coords: '24.5, -24.5' },
                { id: -10, name: 'Place 10', address: 'Address 10', coords: '25.5, -25.5' },
                { id: -11, name: 'Place 11', address: 'Address 11', coords: '26.5, -26.5' },
                { id: -12, name: 'Place 12', address: 'Address 12', coords: '27.5, -27.5' },
                { id: -13, name: 'Place 13', address: 'Address 13', coords: '28.5, -28.5' },
                { id: -14, name: 'Place 14', address: 'Address 14', coords: '29.5, -29.5' },
                { id: -15, name: 'Place 15', address: 'Address 15', coords: '30.5, -30.5' },
                { id: -16, name: 'Place 16', address: 'Address 16', coords: '31.5, -31.5' },
                { id: -17, name: 'Place 17', address: 'Address 17', coords: '32.5, -32.5' },
                { id: -18, name: 'Place 18', address: 'Address 18', coords: '33.5, -33.5' },
                { id: -19, name: 'Place 19', address: 'Address 19', coords: '34.5, -34.5' },
                { id: -20, name: 'Place 20', address: 'Address 20', coords: '35.5, -35.5' },
                { id: -21, name: 'Place 21', address: 'Address 21', coords: '36.5, -36.5' },
                { id: -22, name: 'Place 22', address: 'Address 22', coords: '37.5, -37.5' },
                { id: -23, name: 'Place 23', address: 'Address 23', coords: '38.5, -38.5' },
                { id: -24, name: 'Place 24', address: 'Address 24', coords: '39.5, -39.5' },
                { id: -25, name: 'Place 25', address: 'Address 25', coords: '40.5, -40.5' },
            ];
        },

        //this is used to add the current location into the table, update timezone, push items into places and markers array
        showAddress(lat, lng) {
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.getApiKey()}`;
            this.addMarker(lat, lng);
            this.getTimeZone(lat, lng);

            fetch(geocodeUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'OK' && data.results.length > 0) {
                        const address = data.results[0].formatted_address;
                        this.addPlace(this.markers[this.markers.length - 1], `Current Location - ${new Date().toLocaleString()}`, address);
                    } else {
                        console.error('Address not found');
                    }

                })
                .catch(error => console.error('Error:', error));
        },
        //setting up api key from .env or via terminal cmd
        getApiKey() {
            if (!process.env.VUE_APP_API_KEY) {
                console.error("API key is not set.");
                return null; // Or handle the error as needed
            }
            return process.env.VUE_APP_API_KEY;
        },
        getTimeZone(lat, lng) {
            const timestamp = Math.round((new Date()).getTime() / 1000);
            const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${this.getApiKey()}`;
            fetch(timezoneUrl)
                .then(response => response.json())
                .then(timezoneData => {
                    if (timezoneData.status === 'OK') {
                        this.latestTimezone = timezoneData.timeZoneId;
                        this.timezoneOffset = timezoneData.rawOffset;
                        //console.log(this.latestTimezone, this.timezoneOffset);
                        //console.log(new Date());
                        //console.log(new Date((new Date()).getTime()));
                        this.updateLocalTime();
                    } else {
                        console.error('Timezone data not found');
                    }
                })
                .catch(error => console.error('Error:', error));
        },
        updateLocalTime() {
            const currentTime = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
            const localTime = new Date(currentTime.getTime() + this.timezoneOffset * 1000);
            this.localTime = localTime.toLocaleString();
            //console.log(this.localTime);
        },
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
    beforeDestroy() {
        clearInterval(this.timeInterval);
    },


    data() {
        return {
            currentLocation: [],
            map: null,
            markers: [],
            searchQuery: '',

            // headers: [
            //     { text: 'Latitude', value: 'lat' },
            //     { text: 'Longitude', value: 'lng' },
            //     { text: 'select', value: 'data-table-select' },
            // ],
            headers: [
                { text: 'Name', value: 'name' },
                { text: 'Address', value: 'address' },
                { text: 'Coordinates', value: 'coords' },
            ],
            selected: [],
            places: [],

            latestTimezone: '',
            timezoneOffset: 0,
            localTime: '',
        };
    }
}

</script>
<style>
#fullPageHeader {
    border: 2px solid red;
    width: 100vw;
    height: 1500px;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    margin: auto;
}


.v-data-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

.v-data-table th,
.v-data-table td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}
</style>