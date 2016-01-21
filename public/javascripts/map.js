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

        // Animation constants
        var PREVIEW_FRAMES_PER_SECOND = 8;
        var PREVIEW_ANIM_TIMEOUT = 1000 / PREVIEW_FRAMES_PER_SECOND;

        var iconCount = value.iconcount;
        var count = 1;

        var drawCanvas = function() {
            var context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(image,0,0,canvas.width,canvas.height);
        };

        var image = new Image;

        var iconSize = 128;
        var canvas;
        var animation = false;

        var icon = L.canvasIcon({
            iconSize: new L.Point(iconSize, iconSize),
            iconAnchor: [iconSize / 2, iconSize / 2],
            popupAnchor: [0, -iconSize / 2],
            drawIcon: function (icon, type) {
                canvas = icon;
                image.onload = drawCanvas;
                image.src = value.icons + '/icon'+ pad(count,4) + '.png';
            }
        });



        var animateCanvas = function() {
            count = (count % iconCount) + 1;
            image.src = value.icons + '/icon'+ pad(count,4) + '.png';
            if(animation) {
                setTimeout(animateCanvas, PREVIEW_ANIM_TIMEOUT);
            }
        };

        var startAnimation = function() {
            animation = true;
            animateCanvas();
        };

        var stopAnimation = function() {
            animation = false;
        };


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
            startAnimation();
            this.openPopup();
            map.options.maxZoom = maxZoom + 1;
            active_marker = key;
        });
        marker.on('mouseout', function (e) {
            stopAnimation();
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

var pad = function(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
