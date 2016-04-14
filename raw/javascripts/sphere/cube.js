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
        _id: null,

        init: function (id,data,onReady) {
            this._id = id;
            this._data = data;

            var image = data.images.cubemap[explore.config.resolutions[explore.config.res].cubemap].path;
            var directions = ["nx", "px", "py", "ny", "pz", "nz"];
            var materials = [];
            var count = directions.length;
            for (var direction in directions) {
                var texture = THREE.ImageUtils.loadTexture(image + '/' + directions[direction] + '/0.0.jpg', {}, function () {
                    count--;
                    if (count === 0) {
                        onReady();
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
        },
        getInitial: function() {
            var initial = 0;
            if (this._data.initialView.long !== undefined) { //todo: add lat
                initial = math.eval(this._data.initialView.long);
            }
            return initial;
        },
        getID: function () {
            return this._id;
        }
    };

}(window));