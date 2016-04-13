(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var sphere = window.explore.sphere;
    var explore = window.explore;
    var document = window.document;
    var $ = window.$;
    var self = null;

    sphere.Events = {
        _LONG_OFFSET: 2,
        _LAT_OFFSET: 2,
        _ZOOM_SPEED: 2,

        _sphere: null,
        _mouse: null,
        _mouseStart: null,
        _raycaster: null,
        _mousedown: false,
        _zoomLvl: 0,

        _clickedObjects: [],

        init: function (sphereObj) {
            self = this;
            self._sphere = sphereObj;
            self._mouse = new THREE.Vector2();
            self._oldMouse = new THREE.Vector2();
            self._raycaster = new THREE.Raycaster();

            var sphereDiv = document.getElementById("sphere");


            explore.addEvent(window,'resize',self._sphere.fitToContainer);
            explore.addEvent(sphereDiv, 'mousedown', self._onMouseDown);
            explore.addEvent(sphereDiv, 'mousemove', self._onMouseMove);
            explore.addEvent(sphereDiv, 'mouseup', self._onMouseUp);
            //
            // explore.addEvent(document, 'touchstart', onTouchStart);
            // explore.addEvent(document, 'touchend', onMouseUp);
            // explore.addEvent(document, 'touchmove', onTouchMove);
            //
            explore.addEvent(sphereDiv, 'mousewheel', self._onMouseWheel);
            explore.addEvent(sphereDiv, 'DOMMouseScroll', self._onMouseWheel);

            return self;
        },
        removeEvents: function () {
            var sphereDiv = document.getElementById("sphere");
            explore.removeEvent(window,'resize',self._sphere.fitToContainer);
            explore.removeEvent(sphereDiv, 'mousedown', self._onMouseDown);
            explore.removeEvent(sphereDiv, 'mousemove', self._onMouseMove);
            explore.removeEvent(sphereDiv, 'mouseup', self._onMouseUp);
            //
            // explore.addEvent(document, 'touchstart', onTouchStart);
            // explore.addEvent(document, 'touchend', onMouseUp);
            // explore.addEvent(document, 'touchmove', onTouchMove);
            //
            explore.removeEvent(sphereDiv, 'mousewheel', self._onMouseWheel);
            explore.removeEvent(sphereDiv, 'DOMMouseScroll', self._onMouseWheel);
        },

        _onMouseDown: function (evt) {
            var viewerSize = self._sphere.getViewerSize();
            self._mouse.x = ( evt.clientX / viewerSize.width ) * 2 - 1;
            self._mouse.y = -( evt.clientY / viewerSize.height ) * 2 + 1;
            self._mousedown = true;
            self._oldMouse.x = self._mouse.x;
            self._oldMouse.y = self._mouse.y;

            self._raycaster.setFromCamera(self._mouse, self._sphere.getSubScene().getCamera());
            var intersects = self._raycaster.intersectObjects(self._sphere.getClickableObjects());
            if (intersects.length > 0) {
                self._clickedObjects[0] = intersects[0].object;
                self._clickedObjects[0].material.color.setHex(0x999999);
                self._sphere.render();
            }
        },

        _onMouseMove: function (evt) {
            var viewerSize = self._sphere.getViewerSize();
            if (self._clickedObjects[0] !== undefined) {
                self._mouse.x = ( evt.clientX / viewerSize.width ) * 2 - 1;
                self._mouse.y = -( evt.clientY / viewerSize.height ) * 2 + 1;
                self._raycaster.setFromCamera(self._mouse, self._sphere.getSubScene().getCamera());
                var intersects = self._raycaster.intersectObjects(self._clickedObjects);
                if (!intersects.length > 0) {
                    self._clickedObjects[0].material.color.setHex(0xffffff);
                    self._clickedObjects[0] = undefined;
                }
            }
            evt.preventDefault();
            var viewerSize = self._sphere.getViewerSize();
            var x = ( evt.clientX / viewerSize.width ) * 2 - 1;
            var y = -( evt.clientY / viewerSize.height ) * 2 + 1;
            self._move(x,y);
        },

        _onMouseUp: function (evt) {
            self._mousedown = false;
            //touchzoom = false;

            if (self._clickedObjects[0] !== undefined) {
                self._clickedObjects[0].material.color.setHex(0xffffff);
                if(self._clickedObjects[0].userData.clickaction.type === "change_sphere") {
                    self._sphere.loadNewSphere(self._clickedObjects[0].userData.clickaction.data);
                    //alert(self._clickedObjects[0].userData.clickaction.data);
                } else if (self._clickedObjects[0].userData.clickaction.type === "show_popup") {
                    explore.popup.showPopup(self._clickedObjects[0].userData.clickaction.data.content);
                    //alert(self._clickedObjects[0].userData.clickaction.data);
                }
                self._clickedObjects[0] = undefined;
            }
            self._sphere.render();

        },

        _move: function (x, y) {
            var oldMouse = self._oldMouse;
            var subScene0 = self._sphere.getSubScene(0);
            var subScene1 = self._sphere.getSubScene(1);

            if (self._mousedown) {

                var lat0 = self._stayBetween((y-oldMouse.y)*-self._LAT_OFFSET + subScene0.getLat(),-Math.PI/2.0,Math.PI/2.0);
                var long0 = self._getAngleMeasure((x-oldMouse.x)*self._LONG_OFFSET) + subScene0.getLong();
                subScene0.setLatLong(lat0,long0);

                var lat1 = self._stayBetween((y-oldMouse.y)*-self._LAT_OFFSET + subScene1.getLat(),-Math.PI/2.0,Math.PI/2.0);
                var long1 = self._getAngleMeasure((x-oldMouse.x)*self._LONG_OFFSET) + subScene1.getLong();
                subScene1.setLatLong(lat1,long1);

                oldMouse.x = x;
                oldMouse.y = y;

                self._sphere.render();
            }
        },

        _onMouseWheel: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var delta = (evt.detail) ? -evt.detail : evt.wheelDelta;

            if (delta != 0) {
                var direction = parseInt(delta / Math.abs(delta));
                self._zoom(self._zoomLvl + direction * self._ZOOM_SPEED);
            }
        },

        _zoom: function (level) {
            var zoomLvl = self._zoomLvl = self._stayBetween(parseInt(Math.round(level)), 0, 100);

            self._sphere.getSubScene(0).zoom(zoomLvl);
            self._sphere.getSubScene(1).zoom(zoomLvl);
            self._sphere.render();
        },

        _getAngleMeasure: function (angle, is_2pi_allowed) {
            is_2pi_allowed = (is_2pi_allowed !== undefined) ? !!is_2pi_allowed : false;
            return (is_2pi_allowed && angle == 2 * Math.PI) ? 2 * Math.PI : angle - Math.floor(angle / (2.0 * Math.PI)) * 2.0 * Math.PI;
        },

        _stayBetween: function (x, min, max) {
            return Math.max(min, Math.min(max, x));
        }

    };

}(window));