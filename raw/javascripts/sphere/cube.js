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
        _image: null,
        _id: null,

        init: function (id,image,onReady) {
            this._id = id;
            this._image = image;

            var directions = ["nx", "px", "py", "ny", "pz", "nz"];
            var materials = [];
            var count = directions.length;
            for (var direction in directions) {
                var texture = THREE.ImageUtils.loadTexture(image + '/' + directions[direction] + '/0.0.jpg', {}, function () {
                    count--;
                    if (count === 0) {
                        onReady();
                        /**
                         * Indicates that the loading is finished: the first image is rendered
                         * @callback PhotoSphereViewer~onReady
                         **/

                        //Todo
                        //triggerAction('ready');

                        //if (startAnimation) {
                        //    inOutAnimation(false);
                        //}

                        //render();
                    }
                });
                materials.push(new THREE.MeshBasicMaterial({map: texture, overdraw: true}));
            }
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
        getCube: function () {
            return this._cube;
        },
        setPosition: function (x,y,z) {
            this._cube.position.set(x, y, z);
        }
    };

}(window));