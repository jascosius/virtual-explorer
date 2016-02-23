(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.map === undefined) {
        window.explore.map = {};
    }
    window.console.log('map.js');
    var explore = window.explore;
    var map = window.explore.map;
    var document = window.document;
    var $ = window.$;

    map.Map = {
        _id: null,
        _data: null,
        _spheres: null,
        _callback: null,
        _map: null,
        _minZoom: 16,
        _maxZoom: 19,
        _markers: null,
        init: function(id, data, spheres, callback) {
            this._id = id;
            this._data = data;
            this._spheres = spheres;
            this._callback = callback;

            L.Icon.Default.imagePath = '/images/leaflet';

            var northWest = L.latLng(54.349024, 10.101001),
                southEast = L.latLng(54.335277, 10.129754),
                bounds = L.latLngBounds(northWest, southEast);

            this.map = L.map(id, {
                center: [54.3389585, 10.1190736],
                zoom: this._minZoom,
                maxBounds: bounds
            });

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: this._minZoom,
                maxZoom: this._maxZoom,
                attribution: osmAttrib
            });

            this._map.addLayer(osm);

            this._markers = L.markerClusterGroup({spiderfyDistanceMultiplier: 5});



        }


    }

}(window));

explore.loadMap('44c2e9bdcaf4c29b');