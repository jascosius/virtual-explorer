/**
 * Class to handle the cube for the cubemap
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

    sphere.Cube = {
        _cube: null,
        _data: null,
        _id: "",

        /**
         * Initializes a cube
         * @param id {string} - ID of the sphere shown by the cube
         * @param data {object} - JavaScript object corresponding to the JSON for this sphere
         * @param onReady {function} - Function is called, when cube is ready
         * @returns {window.explore.sphere.Cube}
         */
        init: function (id,data,onReady) {
            this._id = id;
            this._data = data;

            var image = data.images.cubemap[explore.config.resolutions[explore.config.res].cubemap].path;
            var directions = ["nx", "px", "py", "ny", "pz", "nz"];
            var materials = [];
            var count = directions.length;
            
            //Load texture for every side
            for (var direction in directions) {
                if(directions.hasOwnProperty(direction)) {
                    var texture = THREE.ImageUtils.loadTexture(image + '/' + directions[direction] + '/0.0.jpg', {}, function () {
                        count--;
                        if (count === 0) {
                            onReady();
                        }
                    });
                    materials.push(new THREE.MeshBasicMaterial({map: texture, overdraw: true}));
                }
            }
            
            //Initializes the three.js cube
            var geometry = new THREE.BoxGeometry(2000, 2000, 2000);
            var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.scale.x = -1;
            mesh.position.set(0, 0, 0);
            mesh.userData.belongsTo = id;
            mesh.userData.type = "cube";
            mesh.userData.id = id;
            mesh.name = "Cube " + id;
            this._cube = mesh;
            return this;
        },
        /**
         * Returns the three.js cube wrapped by this class
         * @returns {object}
         */
        getCube: function () {
            return this._cube;
        },
        /**
         * Sets the position of the cube in the scene
         * @param x
         * @param y
         * @param z
         */
        setPosition: function (x,y,z) {
            this._cube.position.set(x, y, z);
        },
        /**
         * Returns the initial camera long to view this cube
         * @returns {number}
         */
        getInitial: function() {
            var initial = 0;
            if (this._data.initialView.long !== undefined) {
                initial = math.eval(this._data.initialView.long);
            }
            return initial;
        },
        /**
         * Returns the ID of the sphere shown by the cube
         * @returns {string}
         */
        getID: function () {
            return this._id;
        }
    };

}(window));