(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var explore = window.explore;
    var sphere = window.explore.sphere;
    var document = window.document;
    var $ = window.$;

    sphere.SubScene = {
        _PSV_FOV_MAX: 30,

        _scene: null,
        _camera: null,
        _sphere: null,
        _lat: 0,
        _long: 0,
        
        init: function (sphere) {
            var self = this;
            self._sphere = sphere;
            self._scene = new THREE.Scene();
            self._camera = new THREE.PerspectiveCamera(self._PSV_FOV_MAX, sphere.getViewerSize().ratio, 1, 3000);
            self._camera.position.set(0, 0, 0);
            self._scene.add(self._camera);
            return this;
        },
        
        getLat: function () {
            return this._lat;
        },
        getLong: function () {
            return this._long;
        },
        setLatLong: function (lat,long) {
            var self = this;
            self._lat = lat;
            self._long = long;
            var point = self._sphere.getCartesian(1, lat, long);
            self._camera.lookAt(point);
        },
        getScene: function () {
            return this._scene;
        },
        getCamera: function () {
            return this._camera;
        },
        updateSize: function () {
            this._camera.aspect = this._sphere.getViewerSize().ratio;
            this._camera.updateProjectionMatrix();
        }
    };

}(window));