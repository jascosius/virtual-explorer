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
    var self = null;

    sphere.Animation = {

        _sphere: null,
        _oldLong: null,
        _newLong: null,
        _oldCube: null,
        _newCube: null,
        _onReady: null,
        _step: 0,
        
        _ANIMATION_STEPS: 20,
        _ANIMATION_TIMEOUT: 1000/60,
        init: function (sphere, oldLong, newLong, oldCube, newCube, onReady) {
            self = this;
            self._sphere = sphere;
            self._oldLong = (oldLong + Math.PI) % (2 * Math.PI);
            self._newLong = newLong;
            self._oldCube = oldCube;
            self._newCube = newCube;
            self._onReady = onReady;

            return self;
        },
        animate: function () {
            var nonActiveSceneNumber = self._sphere.getNonActiveSceneNumber();
            self._step++;
            sphere.scene.setMixRatioValue(Math.abs(nonActiveSceneNumber - self._step / self._ANIMATION_STEPS));

            var oldCubePosition = self._sphere.getCartesian(self._step * 30, 0, self._oldLong);
            var newCubePosition = self._sphere.getCartesian(self._ANIMATION_STEPS * 30 - self._step * 30, 0, self._newLong);
            
            self._oldCube.setPosition(oldCubePosition.x,oldCubePosition.y,oldCubePosition.z);
            self._newCube.setPosition(newCubePosition.x,newCubePosition.y,newCubePosition.z);
            if (self._step !== self._ANIMATION_STEPS) {
                setTimeout(self.animate, self._ANIMATION_TIMEOUT);
            } else {
                self._onReady();
            }
            self._sphere.render();
        }
    };

}(window));