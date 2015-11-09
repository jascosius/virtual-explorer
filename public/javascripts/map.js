/**
 *
 * @param id - id of the html element
 * @param data - map_.....json object
 */
var createMap = function( id, data ) {

    var minZoom = 16;
    var maxZoom = 19;

    L.Icon.Default.imagePath = '/images/leaflet';

    var northWest = L.latLng(54.349024, 10.101001),
        southEast = L.latLng(54.335277, 10.129754),
        bounds = L.latLngBounds(northWest, southEast);

    var map = L.map(id, {
        center: [54.3389585, 10.1190736],
        zoom: minZoom,
        maxBounds: bounds
    });

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: minZoom,
        maxZoom: maxZoom,
        attribution: osmAttrib
    });

    map.addLayer(osm);
    var spheres = data.spheres;
    $.each( spheres, function (key, value) {
        var latitude = value.latitude;
        var longitude = value.longitude;
        var name = $.i18n.t(value.name);
        var marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(name);
        marker.on('mouseover', function (e) {
            this.openPopup();
            map.options.maxZoom = maxZoom + 1;
            active_marker = key;
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
            map.options.maxZoom = maxZoom;
            active_marker = null;
        });
        marker.on('click', function (e) {
            removeMap(id);
            loadSphere(key);
        });
    });

    var active_marker;
    var sphere_id;

    map.on('zoomstart', function() {
        sphere_id = active_marker;
    });

    map.on('zoomend', function() {
        if(map.getZoom() === (maxZoom + 1)) {
            removeMap(id);
            loadSphere(sphere_id);
        }
    });
};