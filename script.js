mapboxgl.accessToken = "pk.eyJ1IjoicGV0ZXJwaGFtMDQiLCJhIjoiY21pbzFvejF2MXo5ZzNkcTMxN3F3MHNxaSJ9.5D8AFre9XNsesLji025yKA";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-120, 37],
    zoom: 2
});

let earthquakeData = null;

async function loadEarthquakes() {

    const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
    );

    earthquakeData = await response.json();

    map.addSource("earthquakes", {
        type: "geojson",
        data: earthquakeData,
        cluster: true,
        clusterMaxZoom: 6,
        clusterRadius: 50
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
            "circle-color": "#ff5722",
            "circle-radius": [
                "step",
                ["get", "point_count"],
                15,
                10,
                20,
                25,
                25
            ]
        }
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12
        }
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, "#2DC4B2",
                3, "#3BB3C3",
                5, "#669EC4",
                7, "#8B88B6",
                9, "#A2719B"
            ],
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, 4,
                6, 10
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });

    map.on("click", "unclustered-point", (e) => {

        const coordinates = e.features[0].geometry.coordinates.slice();
        const mag = e.features[0].properties.mag;
        const place = e.features[0].properties.place;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<strong>${place}</strong><br>Magnitude: ${mag}`)
            .addTo(map);
    });

}

map.on("load", loadEarthquakes);

function applyFilters() {

    if (!earthquakeData) return;

    const magValue = parseFloat(document.getElementById("magSlider").value);
    const timeValue = parseInt(document.getElementById("timeSlider").value);

    document.getElementById("magValue").textContent = magValue;
    document.getElementById("timeValue").textContent = timeValue;

    const now = Date.now();
    const cutoff = now - (timeValue * 3600000);

    const filtered = {
        type: "FeatureCollection",
        features: earthquakeData.features.filter(eq => {

            const mag = eq.properties.mag;
            const time = eq.properties.time;

            return mag >= magValue && time >= cutoff;

        })
    };

    map.getSource("earthquakes").setData(filtered);
}

document.getElementById("magSlider").addEventListener("input", applyFilters);
document.getElementById("timeSlider").addEventListener("input", applyFilters);
