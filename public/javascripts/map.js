/**
 *
 * @param id - id of the html element
 * @param data - map_.....json object
 * @param spheres - all spheres on the map
 */
var createMap = function (id, data, spheres, callback) {

    var setupSpheres = false;

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
    var markers = L.markerClusterGroup({spiderfyDistanceMultiplier: 5});
    $.each(spheres, function (key, value) {

        var iconSize = 128;

        var icon = L.icon({
            iconUrl: value.icon,
            iconSize: [iconSize,iconSize],
            iconAnchor: [iconSize/2,iconSize/2],
            popupAnchor: [0,-iconSize/2]
        });
        var latitude = value.latitude;
        var longitude = value.longitude;
        var marker = L.marker([latitude, longitude],{icon: icon});

        if(setupSpheres) {
            marker.bindPopup(value.id);
        } else if(value.name !== undefined) {
            var name = $.i18n.t(value.name);
            marker.bindPopup(name);
        }

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
            callback(key);
            //loadSphere(key);
                                             //TODO: zoomIn animation
        });
        markers.addLayer(marker);
    });

    map.addLayer(markers);

    var active_marker;
    var sphere_id;

    map.on('zoomstart', function () {
        sphere_id = active_marker;
    });

    map.on('zoomend', function () {
        if (map.getZoom() === (maxZoom + 1)) {
            callback(sphere_id);
            //loadSphere(sphere_id);
        }
    });
};