/**
 * Class which handles the marker on a map
 */
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
    
    map.Marker = {
        _marker: null,

        _PREVIEW_FRAMES_PER_SECOND: 8, //Speed of the animated preview images
        /**
         * Initializes a Marker object
         * @param sphereObj {object} - JavaScript object corresponding to the JSON which describes the sphere of the marker
         * @param mapObj {object} - JavaScript object corresponding to the JSON which describes the map
         * @returns {Window.explore.map.Marker}
         */
        init: function(sphereObj,mapObj) {
            // Animation constants
            var PREVIEW_ANIM_TIMEOUT = 1000 / this._PREVIEW_FRAMES_PER_SECOND;

            var resolution = window.explore.config.resolutions[window.explore.config.res].preview;

            var iconCount = sphereObj.images.preview[resolution].count;
            var count = 1;
            var image = new Image;
            var iconSize = parseInt(resolution);
            if (iconSize <= 128) {
                iconSize = 128;
            }
            var canvas;
            var animation = false;

            var drawCanvas = function() {
                var context = canvas.getContext('2d');
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(image,0,0,canvas.width,canvas.height);
            };

            var self = this;

            //Set icon of the marker (uses a canvas to animate the preview)
            var icon = L.canvasIcon({
                iconSize: new L.Point(iconSize, iconSize),
                iconAnchor: [iconSize / 2, iconSize / 2],
                popupAnchor: [0, -iconSize / 2],
                drawIcon: function (icon, type) {
                    canvas = icon;
                    image.onload = drawCanvas;
                    image.src = sphereObj.images.preview[resolution].path + '/icon'+ self.pad(count,4) + '.png';
                }
            });
            
            var animateCanvas = function() {
                count = (count % iconCount) + 1;
                image.src = sphereObj.images.preview[resolution].path + '/icon'+ self.pad(count,4) + '.png';
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

            var latitude = sphereObj.coords.lat;
            var longitude = sphereObj.coords.long;
            var marker = this._marker = L.marker([latitude, longitude],{icon: icon});

            if(sphereObj.name !== undefined) {
                var name = $.i18n.t(sphereObj.name);
                marker.bindPopup(name);
            }

            marker.on('mouseover', function (e) {
                startAnimation();
                marker.openPopup();
            });
            marker.on('mouseout', function (e) {
                stopAnimation();
                marker.closePopup();
            });
            marker.on('click', function (e) {
                stopAnimation();
                window.explore.startLoading();
                window.explore.loadSphere(sphereObj.id,true,true);
                mapObj.on('zoomend',window.explore.disableMap);
                mapObj.options.maxZoom = mapObj.getZoom() + 1;
                mapObj.setZoom(mapObj.getZoom() + 1);
            });
            return this;
        },

        /**
         * Returns 'num' with length 'size' (leading zeros)
         * @param num
         * @param size
         * @returns {string}
         */
        pad: function(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        },
        /**
         * Returns the leaflet marker wrapped by this class
         * @returns {null}
         */
        getMarker: function() {
            return this._marker;
        }
    }



}(window));