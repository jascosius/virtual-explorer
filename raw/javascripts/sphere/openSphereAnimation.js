(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var sphere = window.explore.sphere;
    var $ = window.$;

    sphere.OpenSphereAnimation = {

        _sphere: null,
        _fromLat: null,
        _toLat: null,
        _long: null,
        _cube: null,
        _rewind: null,
        _onReady: null,
        _step: 0,

        _ANIMATION_STEPS: 30,
        _ANIMATION_TIMEOUT: 1000/60,
        _START_POSITION: -900,
        init: function (sphere, fromLat, toLat, long, cube, rewind, onReady) {
            this._sphere = sphere;
            this._fromLat = fromLat;
            if(fromLat == null) {
                if(!rewind) {
                    this._fromLat = - Math.PI / 2 + 0.1;
                } else {
                    this._fromLat = 0;
                }
            }
            this._toLat = toLat;
            if(toLat == null) {
                if(!rewind) {
                    this._toLat = 0;
                } else {
                    this._toLat = - Math.PI / 2 + 0.1;
                }
            }
            this._long = long;
            this._cube = cube;
            this._rewind = rewind;
            this._onReady = onReady;

            return this;
        },
        animate: function () {
            var diff = Math.abs(this._toLat - this._fromLat);
            var multiplicator = this._step / this._ANIMATION_STEPS;

            var multiplicatorY = (this._ANIMATION_STEPS - this._step) / this._ANIMATION_STEPS;
            if(this._rewind) {
                multiplicatorY = multiplicator;
            }

            var newYPosition = multiplicatorY * this._START_POSITION;

            var newLat = null;
            if(this._toLat < this._fromLat) {
                newLat = this._fromLat - multiplicator * diff;
            } else {
                newLat = this._fromLat + multiplicator * diff;
            }
            this._sphere.getSubScene().setLatLong(newLat,this._long);
            this._cube.setPosition(0,newYPosition,0);

            this._step = this._step + 1;
            if (this._step <= this._ANIMATION_STEPS) {
                setTimeout(this.animate.bind(this), this._ANIMATION_TIMEOUT);
            } else {
                this._onReady();
            }
            this._sphere.render();
        }
    };

}(window));