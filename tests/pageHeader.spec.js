import { mount } from '@vue/test-utils';
import PageHeader from '@/src/layout/pageHeader.vue';
import Vue from 'vue';


global.google = {
    maps: {
        Marker: jest.fn().mockImplementation((options) => ({
            setPosition: jest.fn(),
            setMap: jest.fn(),
            position: options.position, // This now stores the position passed to the constructor
            // Add any other properties or methods used by your component
        })),        Map: jest.fn().mockImplementation(() => ({ setCenter: jest.fn() })),
    },
};
/*when using this mock jest and fetch is being intercepted, a random location would be generated */
function generateRandomCoordinates() {
    return {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
    };
}
//mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => {
            const mockData = {
                status: 'OK',
                results: [{ geometry: { location: generateRandomCoordinates() } }]
            };
            console.log('Mock fetch data:', mockData);
            return Promise.resolve(mockData);
        }
    })
);


describe('PageHeader', () => {
    let wrapper;
    beforeEach(() => {
        fetch.mockClear();
        google.maps.Marker.mockClear();
        google.maps.Map.mockClear();
        const mockMap = {
            setCenter: jest.fn().mockImplementation((location) => {
                console.log('setCenter called with:', location);
            })
        };
        wrapper = mount(PageHeader);
        wrapper.vm.map = mockMap;
    });
    it('should add a marker correctly', () => {
        const lat = -34.397;
        const lng = 150.644;
        wrapper.vm.addMarker(lat, lng);
        expect(wrapper.vm.markers.length).toBe(1);
        expect(wrapper.vm.markers[0].position).toEqual({ lat, lng });
    });
    it('should call addMarker with mock data on searchLocation', async () => {
        wrapper.vm.searchQuery = 'Some Address';

        await wrapper.vm.searchLocation();

        // Check if markers were added as expected
        expect(wrapper.vm.markers.length).toBeGreaterThan(0);
        expect(wrapper.vm.markers[0].position.lat).toBeGreaterThanOrEqual(-90);
        expect(wrapper.vm.markers[0].position.lat).toBeLessThanOrEqual(90);
        expect(wrapper.vm.markers[0].position.lng).toBeGreaterThanOrEqual(-180);
        expect(wrapper.vm.markers[0].position.lng).toBeLessThanOrEqual(180);
    });


});
