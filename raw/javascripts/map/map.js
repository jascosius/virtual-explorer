(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.map === undefined) {
        window.explore.map = {};
    }
    var map = window.explore.map;
    var $ = window.$;

    map.Map = {
        _data: null, //Object with map information
        _spheres: null, //Object with sphere information
        _map: null, //The leaflet map
        _markers: null, //Group of all markers on the map
        init: function (data, spheres) {
            this._data = data;
            this._spheres = spheres;

            L.Icon.Default.imagePath = '/images/leaflet';

            //Sets the outer bound of the map
            var bound = this._data.bound;
            var northWest = L.latLng(bound.northWest.lat, bound.northWest.long),
                southEast = L.latLng(bound.southEast.lat, bound.southEast.long),
                bounds = L.latLngBounds(northWest, southEast);

            //Creates the Leaflet map
            this._map = L.map('map', {
                center: [54.3389585, 10.1190736],
                zoom: this._data.startZoom,
                maxBounds: bounds
            });

            //Adds the Open Street Map to the Leaflet map
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmUrl, {
                minZoom: this._data.minZoom,
                maxZoom: this._data.maxZoom,
                attribution: osmAttrib
            });
            this._map.addLayer(osm);

            //Creates a group for all marker on the map and adds the marker
            this._markers = L.markerClusterGroup({spiderfyDistanceMultiplier: 5});
            var self = this;
            $.each(spheres, function (key, value) {
                var markerObj = Object.create(map.Marker).init(value,self._map);
                var marker = markerObj.getMarker();
                self._markers.addLayer(marker);
            });
            this._map.addLayer(this._markers);
            
            return this;
        }
    }

}(window));

//explore.loadMap('44c2e9bdcaf4c29b');