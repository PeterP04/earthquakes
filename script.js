mapboxgl.accessToken = "pk.eyJ1IjoicGV0ZXJwaGFtMDQiLCJhIjoiY21pbzFvejF2MXo5ZzNkcTMxN3F3MHNxaSJ9.5D8AFre9XNsesLji025yKA";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v11",
    center: [-120, 37],
    zoom: 2
});

// USGS significant earthquakes past month feed
const dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

map.on("load", () => {

    map.addSource("earthquakes", {
        type: "geojson",
        data: dataURL
    });

    map.addLayer({
        id: "quake-points",
        type: "circle",
        source: "earthquakes",
        paint: {
            "circle-color": "#ff5722",
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, 4,
                6, 12
            ],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1
        }
    });

    // Add popups
    map.on("click", "quake-points", (e) => {
        const coords = e.features[0].geometry.coordinates.slice();
        const mag = e.features[0].properties.mag;
        const place = e.features[0].properties.place;

        new mapboxgl.Popup()
            .setLngLat([coords[0], coords[1]])
            .setHTML(`<strong>${place}</strong><br>Magnitude: ${mag}`)
            .addTo(map);
    });

    // Change cursor to pointer
    map.on("mouseenter", "quake-points", () => {
        map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "quake-points", () => {
        map.getCanvas().style.cursor = "";
    });

});
