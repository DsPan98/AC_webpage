<template>
    <v-app>
        <v-layout class="rounded rounded-md">
            <!-- scroll-behavior="collapse" scroll-threshold="20" -->
            <!--vappbar
        vappbar placed on top, with a hidden nav menu and a setting menu
        collasped and rounded when mouse enter and leave
        structure: nav icon   title   dot vertical icon    -->
            <v-app-bar :elevation="2" style="background: linear-gradient(to right, #BDC3C7, #2C3E50)" class="vAppBar"
                :collapse="isCollapsed && !drawer" :rounded="!isCollapsed || drawer" @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title>Map</v-app-bar-title>
                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>


            </v-app-bar>
            <v-navigation-drawer v-model="drawer" temporary>
                <v-list dense>
                    <v-list-item v-for="(item, i) in navigationItems" :key="i" @click="handleNavigation(item)">

                        <v-list-item-title>{{ item.title }}</v-list-item-title>

                    </v-list-item>
                </v-list>
            </v-navigation-drawer>


            <v-main class="fullPageHeader d-flex align-center flex-column justify-center" style="min-height: 300px;">
                <div id="section0"> Application</div>
                <!-- section1, button here, click and ask for current location -->

                <v-row class="info-container">
                    <!-- Left Column -->
                    <v-col cols="6" sm="8" xs="10"
                        style=" display: flex; flex-direction: column; justify-content: space-around; height: 100%;">
                        <!-- Top Left: Get Current Location Button -->
                        <div id="section1">
                            <v-btn @click="getCurrentLocation" :disabled="isLocationLoading" prepend-icon="mdi-map-marker"
                                :elevation="2"
                                style="margin-bottom: 10px; overflow: hidden; background-color: rgba(255, 255, 255, 0.5) !important; ">
                                <span v-if="isLocationLoading">Loading...</span>
                                <span v-else>Get Current Location</span>
                            </v-btn>
                        </div>

                        <!-- Bottom Left: Search Bar and Button -->
                        <!-- :prepend-icon="isSearchLoading ? 'mdi-loading' : 'mdi-magnify'" -->
                        <div id="section2">
                            <v-text-field v-model="searchQuery"
                                :prepend-icon="isSearchLoading ? 'mdi-loading' : 'mdi-magnify'"
                                :label="isSearchLoading ? 'Loading...' : 'Search'" :rules="[rules.required]" clearable
                                hint="Enter location" placeholder="Type in a location" @keyup.enter="searchLocation"
                                class="search-field"></v-text-field>

                            <v-btn @click="searchLocation"
                                style="background-color: rgba(255, 255, 255, 0.5) !important; ">Search</v-btn>
                        </div>
                    </v-col>

                    <!-- Right Column -->
                    <v-col cols="6" sm="4" xs="10"
                        style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                        <!-- Top Right: Time Zone -->
                        <div>
                            <div v-if="latestTimezone">Time Zone: {{ latestTimezone }}</div>
                        </div>

                        <!-- Bottom Right: Local Time -->
                        <div>
                            <div v-if="localTime">Local Time: {{ localTime }}</div>
                        </div>
                        <div>
                            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                                v-if="currentLocation.length > 0">{{ currentLocation }}
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <!-- section3 map here, with location and marker of searced location -->
                <div id="section3" style="width:90%; margin:auto; margin-top: 50px">
                    <div class="map-container">
                        <div id="map" style="width:100%; height:300px;">
                            <div v-if="!mapLoaded" class="map-placeholder">Loading map...</div>
                        </div>
                    </div>
                </div>

                <!-- section4 table here, with all the searched places -->
                <div id="section4" style="width:90%; align-self:center; margin:auto; margin-bottom: 10px;">
                    <v-btn :elevation="10" @click="deleteSelected" prepend-icon="mdi-delete"
                        style="background-color: rgba(255, 255, 255, 0.5) !important; margin:10px">
                        Delete selected
                    </v-btn>
                    <v-data-table :headers="headers" :items="places" :items-per-page="10" v-model="selected" item-key="id"
                        show-select></v-data-table>
                    <!-- <v-data-table :headers="headers" :items="tableMarkers" :items-per-page="10" show-select
                v-model="selected"></v-data-table> -->

                </div>
                <!-- section5 time zone here -->
                <!-- <div id="section5">
                    Timezone and local time here:
                    <div v-if="latestTimezone">Time Zone: {{ latestTimezone }}</div>
                    <div v-if="localTime">Local Time: {{ localTime }}</div>
                </div> -->
            </v-main>
        </v-layout>
    </v-app>
</template>
<script>
import { toRaw } from 'vue';
export default {
    name: 'Homepage',
    mounted() {
        this.loadMapScript();
        //this.loadTestItems();
        setInterval(this.updateLocalTime, 1000);
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        getCurrentLocation() {
            this.isLocationLoading = true;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
            }
            else {
                alert("Geolocation not supported by the browser");
                this.isLocationLoading = false;
            }
        },
        showPosition(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            alert("Latitude: " + lat + "\nLongitude: " + lng);
            this.currentLocation = [position.coords.latitude, position.coords.longitude];
            // this.addMarker(position.coords.latitude, position.coords.longitude);
            // this.addPlace(this.markers[this.markers.length - 1], 'Current Location', 'test address');
            this.showCurrentAddress(lat, lng);
            this.isLocationLoading = false;
        },
        showError(error) {
            this.isLocationLoading = false;
            console.log(error);

        },

        searchLocation() {
            return new Promise((resolve, reject) => {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.searchQuery)}&key=${this.getApiKey()}`;
                this.isSearchLoading = true;

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
                            this.isSearchLoading = false;

                            resolve();
                            //console.log('the markers array size after push is within fetch:', this.markers.length)

                        } else {
                            this.isSearchLoading = false;
                            console.error('No results found');
                            reject(new Error('No results found'));
                            alert('We could not find the location you typed in.');
                        }
                    })
                    .catch(error => {
                        this.isSearchLoading = false;
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
            this.map.addListener('tilesloaded', () => {
                this.mapLoaded = true;
            });
        },
        addMarker(lat, lng) {
            console.log(`Adding marker at lat: ${lat}, lng: ${lng}`); // Debug output
            const marker = new google.maps.Marker({
                position: { lat, lng },
                map: this.map,
                id: this.generateUniqueId(),
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
            this.selected.forEach(selectedId => {
                const markerIndex = this.markers.findIndex(marker => marker.id === selectedId);
                if (markerIndex > -1) {
                    const rawMarker = toRaw(this.markers[markerIndex]);
                    console.log("Removing marker:", this.markers[markerIndex], markerIndex, selectedId);
                    rawMarker.setMap(null);
                    this.markers.splice(markerIndex, 1);
                }
            });
            this.places = this.places.filter(place => !this.selected.includes(place.id));
            this.selected = [];
        },
        addPlace(marker, searchQuery, address) {
            const newPlace = {
                id: marker.id,
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
        showCurrentAddress(lat, lng) {
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

            this.map.setCenter({ lat: lat, lng: lng });
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

        handleScroll() {
            if (window.scrollY > 150) {
                this.isCollapsed = true;
                window.removeEventListener('scroll', this.handleScroll);
            }
        },
        handleNavigation(item) {
            // Handle navigation item click
            console.log('Navigating to:', item.title);
        },
        //function for appbar collapse
        handleMouseEnter() {
            if (!this.drawer) {
                this.isCollapsed = false;
            }
        },

        handleMouseLeave() {
            if (!this.drawer) {
                this.isCollapsed = true;
            }
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
        window.removeEventListener('scroll', this.handleScroll);
    },


    data() {
        return {
            currentLocation: [],
            map: null,
            mapLoaded: false,
            markers: [],
            searchQuery: '',

            // headers: [
            //     { text: 'Latitude', value: 'lat' },
            //     { text: 'Longitude', value: 'lng' },
            //     { text: 'select', value: 'data-table-select' },
            // ],
            headers: [
                { title: 'Name', value: 'name' },
                { title: 'Address', value: 'address' },
                { title: 'Coordinates', value: 'coords' },
            ],
            selected: [],
            places: [],

            latestTimezone: '',
            timezoneOffset: 0,
            localTime: '',

            isCollapsed: false,



            rules: {
                required: value => !!value || 'Field is required',
            },
            isLocationLoading: false,
            isSearchLoading: false,

            drawer: false,
            navigationItems: [
                { title: 'Home (for future development)' },
                { title: 'Profile (for future development)' },
                { title: 'Settings (for future development)' },
            ],
        };
    }
}

</script>
<style>
.v-data-table-header {
    font-family: 'AlibabaPuHuiTiH';
    font-size: 16px;
    color: #333333;
}

#section0 {
    height: 75px;


    text-align: center;
    font-family: 'AlibabaPuHuiTi-R';
    font-size: 30px;
}

.v-application {
    /* background: linear-gradient(to right, #ff6e7f, #bfe9ff) !important; */
    /* background: linear-gradient(to right, #6a11cb, #2575fc) !important; */
    /* background: linear-gradient(to right, #fad0c4, #ffd1ff) !important; */
    /* background: linear-gradient(to right, #00c6ff, #0072ff) !important; */
    background: linear-gradient(to right, #BDC3C7, #2C3E50) !important;
}


.v-data-table {
    background-color: rgba(255, 255, 255, 0.5) !important;
    /* Light background with some opacity */
    color: #000000 !important;
    /* Black text for contrast */
}

.map-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    /* Same as your map height */
    background-color: #ffffff;
    color: #000000;
    font-size: 20px;
}


.info-container {
    border: 5px solid #333;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    width: 95%;
}

.map-container {
    border: 10px solid #333;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

/*adding a little tv affect in */
.map-container::before {
    content: '';
    display: block;
    position: absolute;
}


/*the current design works best between 700px to 1400px;
scale the size for screen size larger than 1400 and smaller than 700 (width)
*/
.search-field {
    min-width: 100px;
}

#section2 {
    display: flex;
    justify-content: flex-start;
    /* Aligns items to the left */
    align-items: center;
    gap: 2px;
}

@media (max-width: 700px) {
    .fullPageHeader {
        font-size: 12px;

        .v-btn {
            font-size: 7px;
            min-width: 50px;
            line-height: normal;
            white-space: normal;

        }

        .v-data-table {
            font-size: 12px;
        }

    }

    .v-text-field input {
        font-size: 12px !important;
        line-height: normal;

        /* Adjust the font size for smaller screens */
    }

    .search-field {
        width: 150px;
        line-height: normal;

        .v-label,
        .v-messages {
            font-size: 8px;
            line-height: normal;

        }

    }
}

@media (min-width: 1400px) {
    .fullPageHeader {
        font-size: 30px !important;

        .v-btn {
            font-size: 25px !important;
            min-width: 125px;

        }

        .v-data-table {
            font-size: 30px;
        }
    }

    .v-text-field input {
        font-size: 30px !important;
        line-height: normal;
    }

    .search-field {
        width: 400px;


        .v-label,
        .v-messages {
            font-size: 30px;
            margin-top: 4px;
            margin-bottom: 4px;
        }

    }
}
</style>