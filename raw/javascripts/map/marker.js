(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.map === undefined) {
        window.explore.map = {};
    }
    var explore = window.explore;
    var map = window.explore.map;
    var document = window.document;
    var $ = window.$;
    
    map.Marker = {
        _marker: null,
        init: function(sphere,map) {
            var self = this;
            // Animation constants
            var PREVIEW_FRAMES_PER_SECOND = 8;
            var PREVIEW_ANIM_TIMEOUT = 1000 / PREVIEW_FRAMES_PER_SECOND;

            var resolution = explore.config.preview;

            var iconCount = sphere.images.preview[resolution].count; //Todo: Dynamic resolution
            var count = 1;
            var image = new Image;
            var iconSize = parseInt(resolution);
            var canvas;
            var animation = false;

            var drawCanvas = function() {
                var context = canvas.getContext('2d');
                context.clearRect(0,0,canvas.width,canvas.height);
                context.drawImage(image,0,0,canvas.width,canvas.height);
            };

            var icon = L.canvasIcon({
                iconSize: new L.Point(iconSize, iconSize),
                iconAnchor: [iconSize / 2, iconSize / 2],
                popupAnchor: [0, -iconSize / 2],
                drawIcon: function (icon, type) {
                    canvas = icon;
                    image.onload = drawCanvas;
                    image.src = sphere.images.preview[resolution].path + '/icon'+ self.pad(count,4) + '.png'; //Todo: dynamic resolution
                }
            });
            
            var animateCanvas = function() {
                count = (count % iconCount) + 1;
                image.src = sphere.images.preview[resolution].path + '/icon'+ self.pad(count,4) + '.png';
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

            var latitude = sphere.coords.lat;
            var longitude = sphere.coords.long;
            var marker = self._marker = L.marker([latitude, longitude],{icon: icon});

            if(sphere.name !== undefined) {
                var name = $.i18n.t(sphere.name);
                marker.bindPopup(name);
            }

            marker.on('mouseover', function (e) {
                startAnimation();
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                stopAnimation();
                this.closePopup();
            });
            marker.on('click', function (e) {
                explore.loadSphere(sphere.id);
                map.options.maxZoom = map.getZoom() + 1;
                map.setZoom(map.getZoom() + 1);
            });
            return this;
        },
        pad: function(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        },
        getMarker: function() {
            return this._marker;
        }
    }



}(window));