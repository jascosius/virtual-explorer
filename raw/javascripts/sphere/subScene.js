/**
 * Class to handle a sub scene for the cube, the arrows and the info marker
 */
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

        /**
         * Initialize subSphere object
         * @param sphereObj {Sphere} - sphere object
         * @returns {window.explore.sphere.SubScene}
         */
        init: function (sphereObj) {
            this._sphere = sphereObj;
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(this._FOV_MAX, sphereObj.getViewerSize().ratio, 1, 3000);
            this._camera.position.set(0, 0, 0);
            this.setLatLong(0,0);
            this._scene.add(this._camera);
            return this;
        },

        /**
         * Returns the latitude of the camera
         * @returns {number}
         */
        getLat: function () {
            return this._lat;
        },
        /**
         * Returns the longitude of the camera
         * @returns {number}
         */
        getLong: function () {
            return this._long;
        },
        /**
         * Sets latitude and longitude of the camera
         * @param lat {number} - the new latitude
         * @param long {number} - the new longitude
         */
        setLatLong: function (lat,long) {
            this._lat = lat;
            this._long = long;
            var point = this._sphere.getCartesian(1, lat, long);
            this._camera.lookAt(point);
        },
        /**
         * Returns the scene wrapped by this class
         * @returns {object}
         */
        getScene: function () {
            return this._scene;
        },
        /**
         * Returns the camera in the scene
         * @returns {null}
         */
        getCamera: function () {
            return this._camera;
        },
        /**
         * Call if view size changes
         */
        updateSize: function () {
            this._camera.aspect = this._sphere.getViewerSize().ratio;
            this._camera.updateProjectionMatrix();
        },
        /**
         * Changes the zoom level of the camera
         * @param zoomLvl {number} - the new zoom level
         */
        zoom: function (zoomLvl) {
            this._camera.fov = this._FOV_MAX + (zoomLvl / 100) * (this._FOV_MIN - this._FOV_MAX);
            this._camera.updateProjectionMatrix();
        },
        /**
         * Adds a cube to the scene
         * @param cube {Cube} - the cube to add
         */
        addCube: function (cube) {
            this._cube = cube;
            if(cube != null) {
                this._scene.add(cube.getCube());
            }
        },
        /**
         * Returns the cube in the scene
         * @returns {Cube}
         */
        getCube: function () {
            return this._cube;
        },
        /**
         * Delete all objects in the scene (except the cube and the camera)
         * @param cube {boolean} - also delete the cube
         */
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