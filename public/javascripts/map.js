//$.getJSON( "/json/map/example.json", function( data ) {
//    console.log(data);
//    console.log(data.bottomright.longitude);
//    console.log(data.spheres.example.latitude)
//});

//var map = L.map('map').setView([55,0], 2);
//map.attributionControl.setPrefix('');
//
//L.tileLayer('/images/maps/cau/{z}/{x}/{y}.png', {
//    minZoom: 0,
//    maxZoom: 8,
//    tileSize: 256,
//    continuousWorld: true,
//    attribution: 'CAU Kiel'
//}).addTo(map);

// entrance
//L.marker([72.60712, -20.39062]).addTo(map)
//    .bindPopup("Eingang zum Fachschaftsraum").openPopup();

// main entrance
//L.marker([-76.84082, 83.67188]).addTo(map)
//    .bindPopup("<h1>Haupteingang LMS 6</h1> Übergang zu LMS 2, LMS 4 und LMS 8");
//
//addCustomMarker();
//
//function addCustomMarker() {
//    if(window.location.hash.indexOf("mark") !== -1) {
//        hash = window.location.hash.split('/');
//        L.marker([hash[2], hash[3]]).addTo(map)
//            .bindPopup("<h1>Ziel</h1>").openPopup();
//        map.setView([hash[2], hash[3]], 2);
//    }
//}

L.Icon.Default.imagePath = '/images/leaflet';

var northWest = L.latLng(54.349024, 10.101001),
    southEast = L.latLng(54.335277, 10.129754),
    bounds = L.latLngBounds(northWest, southEast);

var map = L.map('map', {
    center: [54.3389585, 10.1190736],
    zoom: 16,
    maxBounds: bounds
});

// create the tile layer with correct attribution
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {
    minZoom: 16,
    maxZoom: 19,
    attribution: osmAttrib
});
map.addLayer(osm);

L.marker([54.346000, 10.110000]).addTo(map).bindPopup("Testkram").openPopup();