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

    sphere.SubScene = {
        _FOV_MAX: 90,
        _FOV_MIN: 30,

        _scene: null,
        _camera: null,
        _sphere: null,
        _lat: 0,
        _long: 0,
        _cube: null,
        
        init: function (sphereObj) {
            this._sphere = sphereObj;
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(this._FOV_MAX, sphereObj.getViewerSize().ratio, 1, 3000);
            this._camera.position.set(0, 0, 0);
            this.setLatLong(0,0);
            this._scene.add(this._camera);
            return this;
        },
        
        getLat: function () {
            return this._lat;
        },
        getLong: function () {
            return this._long;
        },
        setLatLong: function (lat,long) {
            this._lat = lat;
            this._long = long;
            var point = this._sphere.getCartesian(1, lat, long);
            this._camera.lookAt(point);
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
        },
        zoom: function (zoomLvl) {
            this._camera.fov = this._FOV_MAX + (zoomLvl / 100) * (this._FOV_MIN - this._FOV_MAX);
            this._camera.updateProjectionMatrix();
        },
        addCube: function (cube) {
            this._cube = cube;
            if(cube != null) {
                this._scene.add(cube.getCube());
            }
        },
        getCube: function () {
            return this._cube;
        },
        deleteObjects: function (cube) {
            var scene = this._scene;
            for (var i = 0; i < scene.children.length;) {
                var object = scene.children[i];
                var belongsTo = object.userData.belongsTo;
                if (belongsTo !== undefined && belongsTo !== null && (cube || object.userData.type !== "cube")) {
                    scene.remove(object);
                } else {
                    i++;
                }
            }
        }
    };

}(window));