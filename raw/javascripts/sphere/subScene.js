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

    sphere.SubScene = {
        _FOV_MAX: 90,
        _FOV_MIN: 30,

        _scene: null,
        _camera: null,
        _sphere: null,
        _lat: 0,
        _long: 0,
        
        init: function (sphereObj) {
            self = this;
            self._sphere = sphereObj;
            self._scene = new THREE.Scene();
            self._camera = new THREE.PerspectiveCamera(self._FOV_MAX, sphereObj.getViewerSize().ratio, 1, 3000);
            self._camera.position.set(0, 0, 0);
            self.setLatLong(0,0);
            self._scene.add(self._camera);
            return self;
        },
        
        getLat: function () {
            return self._lat;
        },
        getLong: function () {
            return self._long;
        },
        setLatLong: function (lat,long) {
            self._lat = lat;
            self._long = long;
            var point = self._sphere.getCartesian(1, lat, long);
            self._camera.lookAt(point);
        },
        getScene: function () {
            return self._scene;
        },
        getCamera: function () {
            return self._camera;
        },
        updateSize: function () {
            self._camera.aspect = self._sphere.getViewerSize().ratio;
            self._camera.updateProjectionMatrix();
        },
        zoom: function (zoomLvl) {
            self._camera.fov = self._FOV_MAX + (zoomLvl / 100) * (self._FOV_MIN - self._FOV_MAX);
            self._camera.updateProjectionMatrix();
        }
    };

}(window));