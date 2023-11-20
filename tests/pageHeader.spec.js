import { mount } from '@vue/test-utils';
import PageHeader from '@/src/layout/pageHeader.vue';


global.google = {
    maps: {
        Marker: jest.fn().mockImplementation(() => ({ setPosition: jest.fn(), setMap: jest.fn() })),
        Map: jest.fn().mockImplementation(() => ({ setCenter: jest.fn() })),
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
        json: () => Promise.resolve({
            status: 'OK',
            results: [{ geometry: { location: generateRandomCoordinates() } }]
            //results: [{ geometry: { location: { lat: -34.397, lng: 150.644 } } }]
        }),
    })
);



describe('PageHeader', () => {
    let wrapper;
    beforeEach(() => {
        fetch.mockClear();
        google.maps.Marker.mockClear();
        google.maps.Map.mockClear();
        const mockMap = { setCenter: jest.fn() };
        wrapper = mount(PageHeader);
        wrapper.vm.map = mockMap; 
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

    // Additional tests can be added here
});
