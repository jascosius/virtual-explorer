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

    sphere.Animation = {

        _sphere: null,
        _oldLong: null,
        _newLong: null,
        _oldCube: null,
        _newCube: null,
        _onReady: null,
        _step: 0,
        
        _ANIMATION_STEPS: 20,
        _ANIMATION_TIMEOUT: 10000/60,
        init: function (sphere, oldLong, newLong, oldCube, newCube, onReady) {
            this._sphere = sphere;
            this._oldLong = (oldLong + Math.PI) % (2 * Math.PI);
            this._newLong = newLong;
            this._oldCube = oldCube;
            this._newCube = newCube;
            this._onReady = onReady;

            console.log(this._sphere);
            console.log(this._oldLong);
            console.log(newLong);
            console.log(oldCube);
            console.log(newCube);

            return this;
        },
        animate: function () {
            var nonActiveSceneNumber = this._sphere.getNonActiveSceneNumber();
            this._step++;
            sphere.scene.setMixRatioValue(Math.abs(nonActiveSceneNumber - this._step / this._ANIMATION_STEPS));

            var oldCubePosition = this._sphere.getCartesian(this._step * 30, 0, this._oldLong);
            var newCubePosition = this._sphere.getCartesian(this._ANIMATION_STEPS * 30 - this._step * 30, 0, this._newLong);
            
            this._oldCube.setPosition(oldCubePosition.x,oldCubePosition.y,oldCubePosition.z);
            this._newCube.setPosition(newCubePosition.x,newCubePosition.y,newCubePosition.z);
            if (this._step !== this._ANIMATION_STEPS) {
                setTimeout(this.animate.bind(this), this._ANIMATION_TIMEOUT);
            } else {
                this._onReady();
            }
            this._sphere.render();
        }
    };

}(window));