mapboxgl.accessToken = "pk.eyJ1IjoicGV0ZXJwaGFtMDQiLCJhIjoiY21pbzFvejF2MXo5ZzNkcTMxN3F3MHNxaSJ9.5D8AFre9XNsesLji025yKA";

const map = new mapboxgl.Map({
container: "map",
style: "mapbox://styles/mapbox/light-v11",
center: [-100, 40],
zoom: 2
});

const dataURL =
"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

map.on("load", () => {

map.addSource("earthquakes", {
type: "geojson",
data: dataURL,
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
"circle-color": "#51bbd6",
"circle-radius": [
"step",
["get", "point_count"],
20,
100, 30,
750, 40
]
}
});

map.addLayer({
id: "cluster-count",
type: "symbol",
source: "earthquakes",
filter: ["has", "point_count"],
layout: {
"text-field": ["get", "point_count_abbreviated"],
"text-size": 12
}
});

map.addLayer({
id: "quake-points",
type: "circle",
source: "earthquakes",
filter: ["!has", "point_count"],
paint: {

"circle-radius": [
"interpolate",
["linear"],
["get", "mag"],
0, 4,
6, 16
],

"circle-color": [
"interpolate",
["linear"],
["get", "mag"],
0, "#ffffb2",
2, "#fecc5c",
4, "#fd8d3c",
6, "#e31a1c"
],

"circle-opacity": 0.8

}
});

});

map.on("click", "quake-points", (e) => {
  const feature = e.features[0];
  const coords = feature.geometry.coordinates.slice();
  const props = feature.properties;

  // Depth is the third coordinate
  const depth = coords[2];

  // Convert timestamp to readable local date/time
  const date = new Date(props.time).toLocaleString();

  // Display information in popup
  new mapboxgl.Popup()
    .setLngLat([coords[0], coords[1]])
    .setHTML(`
      <strong>${props.place}</strong><br>
      Magnitude: ${props.mag}<br>
      Time: ${date}<br>
      Significance: ${props.sig}<br>
      Community Intensity (CDI): ${props.cdi || "N/A"}<br>
      Alert Level: ${props.alert || "N/A"}<br>
      <a href="${props.url}" target="_blank">USGS Event Page</a>
    `)
    .addTo(map);
});

setInterval(() => {
map.getSource("earthquakes").setData(dataURL);
}, 300000);
