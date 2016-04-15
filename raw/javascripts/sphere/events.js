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

    sphere.Events = {
        _LONG_OFFSET: 2,
        _LAT_OFFSET: 2,
        _ZOOM_SPEED: 3,
        _TOUCH_ZOOM_SPEED: 3,

        _sphere: null,
        _mouse: null,
        _mouseStart: null,
        _raycaster: null,
        _mousedown: false,
        _touchzoom: false,
        _touchzoomDist: 0,
        _zoomLvl: 0,
        _sphereDiv: false,
        _events: [],

        _clickedObjects: [],

        init: function (sphereObj) {
            this._sphere = sphereObj;
            this._mouse = new THREE.Vector2();
            this._oldMouse = new THREE.Vector2();
            this._raycaster = new THREE.Raycaster();

            this._handleEvents(explore.addEvent,true);

            return this;
        },

        _handleEvents: function (func,define) {
            if(define) {
                this._fitToCountainerFunc = this._sphere.fitToContainer.bind(this._sphere);
                this._onMouseDownFunc = this._onMouseDown.bind(this);
                this._onMouseMoveFunc = this._onMouseMove.bind(this);
                this._onMouseUpFunc = this._onMouseUp.bind(this);
                this._onTouchStartFunc = this._onTouchStart.bind(this);
                this._onTouchMoveFunc = this._onTouchMove.bind(this);
                this._onMouseWheelFunc = this._onMouseWheel.bind(this);
            }
            var sphereDiv = this._sphereDiv = document.getElementById("sphere");
            func(window,'rezize',this._fitToCountainerFunc);
            func(sphereDiv,'mousedown',this._onMouseDownFunc);
            func(window,'mousemove',this._onMouseMoveFunc);
            func(window,'mouseup',this._onMouseUpFunc);
            func(sphereDiv,'touchstart',this._onTouchStartFunc);
            func(window,'touchmove',this._onTouchMoveFunc);
            func(window,'touchend',this._onMouseUpFunc);
            func(sphereDiv,'mousewheel',this._onMouseWheelFunc);
            func(sphereDiv,'DOMMouseScroll',this._onMouseWheelFunc);
        },

        removeEvents: function () {
            this._handleEvents(explore.removeEvent,false);
        },

        _onMouseDown: function (evt) {
            console.log('mousedown');
            var viewerSize = this._sphere.getViewerSize();
            this._mouse.x = ( evt.clientX / viewerSize.width ) * 2 - 1;
            this._mouse.y = -( evt.clientY / viewerSize.height ) * 2 + 1;
            this._mousedown = true;
            this._oldMouse.x = this._mouse.x;
            this._oldMouse.y = this._mouse.y;

            this._raycaster.setFromCamera(this._mouse, this._sphere.getSubScene().getCamera());
            var intersects = this._raycaster.intersectObjects(this._sphere.getClickableObjects());
            if (intersects.length > 0) {
                this._clickedObjects[0] = intersects[0].object;
                this._clickedObjects[0].material.color.setHex(0x999999);
                this._sphere.render();
            }
        },

        _onMouseMove: function (evt) {
            var viewerSize = this._sphere.getViewerSize();
            if (this._clickedObjects[0] !== undefined) {
                this._mouse.x = ( evt.clientX / viewerSize.width ) * 2 - 1;
                this._mouse.y = -( evt.clientY / viewerSize.height ) * 2 + 1;
                this._raycaster.setFromCamera(this._mouse, this._sphere.getSubScene().getCamera());
                var intersects = this._raycaster.intersectObjects(this._clickedObjects);
                if (!intersects.length > 0) {
                    this._clickedObjects[0].material.color.setHex(0xffffff);
                    this._clickedObjects[0] = undefined;
                }
            }
            evt.preventDefault();
            var x = ( evt.clientX / viewerSize.width ) * 2 - 1;
            var y = -( evt.clientY / viewerSize.height ) * 2 + 1;
            this._move(x, y);
        },

        _onMouseUp: function (evt) {
            console.log('mouseup');
            this._mousedown = false;
            this._touchzoom = false;

            if (this._clickedObjects[0] !== undefined) {
                this._clickedObjects[0].material.color.setHex(0xffffff);
                if (this._clickedObjects[0].userData.clickaction.type === "newSphere") {
                    this._sphere.loadNewSphere(this._clickedObjects[0].userData.clickaction.data);
                } else if (this._clickedObjects[0].userData.clickaction.type === "showPopup") {

                    explore.popup.showPopup(this._clickedObjects[0].userData.clickaction.data.onClick.content);
                }
                this._clickedObjects[0] = undefined;
            }
            this._sphere.render();

        },

        _move: function (x, y) {
            var oldMouse = this._oldMouse;
            var subScene0 = this._sphere.getSubScene(0);
            var subScene1 = this._sphere.getSubScene(1);

            if (this._mousedown) {

                var lat0 = this._stayBetween((y - oldMouse.y) * -this._LAT_OFFSET + subScene0.getLat(), -Math.PI / 2.0, Math.PI / 2.0);
                var long0 = this._getAngleMeasure((x - oldMouse.x) * this._LONG_OFFSET) + subScene0.getLong();
                subScene0.setLatLong(lat0, long0);

                var lat1 = this._stayBetween((y - oldMouse.y) * -this._LAT_OFFSET + subScene1.getLat(), -Math.PI / 2.0, Math.PI / 2.0);
                var long1 = this._getAngleMeasure((x - oldMouse.x) * this._LONG_OFFSET) + subScene1.getLong();
                subScene1.setLatLong(lat1, long1);

                oldMouse.x = x;
                oldMouse.y = y;

                this._sphere.render();
            }
        },

        _onMouseWheel: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var delta = (evt.detail) ? -evt.detail : evt.wheelDelta;

            if (delta != 0) {
                var direction = parseInt(delta / Math.abs(delta));
                this._zoom(this._zoomLvl + direction * this._ZOOM_SPEED);
            }
        },

        _onTouchStart: function (evt) {
            // Move
            var viewerSize = this._sphere.getViewerSize();
            if (evt.touches.length == 1) {
                var touch = evt.touches[0];
                if (touch.target.parentNode == this._sphereDiv) {
                    this._mouse.x = ( touch.clientX / viewerSize.width ) * 2 - 1;
                    this._mouse.y = -( touch.clientY / viewerSize.height ) * 2 + 1;
                    this._mousedown = true;
                    this._oldMouse.x = this._mouse.x;
                    this._oldMouse.y = this._mouse.y;
                }
            }

            // Zoom
            else if (evt.touches.length == 2) {
                this._onMouseUp();

                if (evt.touches[0].target.parentNode == this._sphereDiv && evt.touches[1].target.parentNode == this._sphereDiv) {
                    this._touchzoomDist = this.dist(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
                    this._touchzoom = true;
                }
            }
        },

        _onTouchMove: function (evt) {
            // Move
            if (evt.touches.length == 1 && this._mousedown) {
                var touch = evt.touches[0];
                if (touch.target.parentNode == this._sphereDiv) {
                    evt.preventDefault();
                    var viewerSize = this._sphere.getViewerSize();
                    var x = ( touch.clientX / viewerSize.width ) * 2 - 1;
                    var y = -( touch.clientY / viewerSize.height ) * 2 + 1;
                    this._move(x, y);
                }
            }

            // Zoom
            else if (evt.touches.length == 2) {
                if (evt.touches[0].target.parentNode == this._sphereDiv && evt.touches[1].target.parentNode == this._sphereDiv && this._touchzoom) {
                    evt.preventDefault();

                    // Calculate the new level of zoom
                    var d = this.dist(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
                    var diff = d - this._touchzoomDist;

                    //alert("4");
                    if (diff != 0) {
                        var direction = diff / Math.abs(diff);
                        this._zoom(this._zoomLvl + direction * this._TOUCH_ZOOM_SPEED);

                        this._touchzoomDist = d;
                    }
                }
            }
        },

        _zoom: function (level) {
            var zoomLvl = this._zoomLvl = this._stayBetween(parseInt(Math.round(level)), 0, 100);

            this._sphere.getSubScene(0).zoom(zoomLvl);
            this._sphere.getSubScene(1).zoom(zoomLvl);
            this._sphere.render();
        },

        _getAngleMeasure: function (angle, is_2pi_allowed) {
            is_2pi_allowed = (is_2pi_allowed !== undefined) ? !!is_2pi_allowed : false;
            return (is_2pi_allowed && angle == 2 * Math.PI) ? 2 * Math.PI : angle - Math.floor(angle / (2.0 * Math.PI)) * 2.0 * Math.PI;
        },

        _stayBetween: function (x, min, max) {
            return Math.max(min, Math.min(max, x));
        },
        dist: function (x1, y1, x2, y2) {
            var x = x2 - x1;
            var y = y2 - y1;
            return x * x + y * y;
        }

    };

}(window));