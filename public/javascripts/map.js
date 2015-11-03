var create_map = function( data ) {

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
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 16,
        maxZoom: 19,
        attribution: osmAttrib
    });

    map.addLayer(osm);
    var spheres = data.spheres;
    for (key in spheres) {
        console.log(key);
        console.log(spheres[key].longitude);
        var latitude = spheres[key].latitude;
        var longitude = spheres[key].longitude;
        var name = spheres[key].name.de_DE;
        var marker = L.marker([latitude, longitude]).addTo(map)
        marker.bindPopup(name);
        marker.on('mouseover', function (e) {
            this.openPopup();
            map.options.maxZoom = 20;
            active_marker = key;
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
            map.options.maxZoom = 19;
            active_marker = null;
        });
    }

    var active_marker;
    var sphere_id;

    map.on('zoomstart', function() {
        sphere_id = active_marker;
    });

    map.on('zoomend', function() {
        if(map.getZoom() === 20) {
            alert("Go to sphere (ID:" + sphere_id +").");
        }
    });
}

$.getJSON( "/json/map/map_44c2e9bdcaf4c29b.json", create_map );