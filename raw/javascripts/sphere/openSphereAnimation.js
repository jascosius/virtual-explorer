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
        _long: null,
        _cube: null,
        _rewind: null,
        _onReady: null,
        _step: 0,

        _ANIMATION_STEPS: 20,
        _ANIMATION_TIMEOUT: 1000/60,
        _START_POSITION: -900,
        init: function (sphere, long, cube, rewind, onReady) {
            this._sphere = sphere;
            this._long = long;
            this._cube = cube;
            this._rewind = rewind;
            this._onReady = onReady;
            this._step = this._ANIMATION_STEPS;

            return this;
        },
        animate: function () {
            var multiplicator = this._step / this._ANIMATION_STEPS;
            if (this._rewind) {
                multiplicator = (this._ANIMATION_STEPS - this._step) / this._ANIMATION_STEPS;
            }
            var newYPosition = multiplicator * this._START_POSITION;
            var newLat = -multiplicator * (Math.PI/2 - 0.1);
            console.log(newLat);
            this._sphere.getSubScene().setLatLong(newLat,this._long);
            
            this._cube.setPosition(0,newYPosition,0);

            this._step = this._step - 1;
            if (this._step > 0) {
                setTimeout(this.animate.bind(this), this._ANIMATION_TIMEOUT);
            } else {
                if(!this._rewind) {
                    this._sphere.getSubScene().setLatLong(0,this._long);
                }
                this._onReady();
            }
            this._sphere.render();
        }
    };

}(window));