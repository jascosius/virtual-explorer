/**
 * Class to handle arrows shown in a sphere
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

    sphere.Arrow = {
        _arrow: null,
        _name: "",
        _data: null,
        _id: "",
        _sphere: null,
        _clickable: false,

        /**
         * Initializes a arrow
         * @param id {string} - ID of the sphere which holds this arrow
         * @param name {string} - Name (number) of this arrow
         * @param data {object} - JavaScript object corresponding to the JSON description of the arrow
         * @param sphere {Sphere} - sphere object
         * @returns {window.explore.sphere.Arrow}
         */
        init: function (id, name, data, sphere) {
            this._id = id;
            this._name = name;
            this._data = data;
            this._sphere = sphere;

            //Sets defaults or values found in 'data'
            var size = 30;
            if (data.size !== undefined)
                size = math.eval(data.size);
            var arrow_texture = '/images/objects/arrow.png';
            if (data.texture !== undefined)
                arrow_texture = data.texture;
            var radius = 90;
            if (data.radius !== undefined)
                radius = math.eval(data.radius);
            var lat = -Math.PI / 8;
            if (data.lat !== undefined)
                lat = math.eval(data.lat);
            var long = math.eval(data.long);
            var rotationX = Math.PI / 2;
            if (data.rotationX !== undefined)
                rotationX = rotationX - math.eval(data.rotationX);
            var rotationY = 0;
            if (data.rotationY !== undefined)
                rotationY = -math.eval(data.rotationY);
            var rotationZ = -long;
            if (data.rotationZ !== undefined)
                rotationZ = -rotationZ - math.eval(data.rotationZ);

            //Initializes the three.js object for the arrow
            var planeGeometry = new THREE.PlaneGeometry(size, size);
            var self = this;
            var planeTexture = THREE.ImageUtils.loadTexture(arrow_texture, {}, function () {
                self._sphere.render()
            });
            var planeMaterial = new THREE.MeshBasicMaterial({
                map: planeTexture,
                side: THREE.DoubleSide,
                transparent: true
            });
            var plane = this._arrow = new THREE.Mesh(planeGeometry, planeMaterial);
            var vector = this._sphere.getCartesian(radius, lat, long);
            plane.position.add(vector);
            plane.rotation.x = rotationX;
            plane.rotation.y = rotationY;
            plane.rotation.z = rotationZ;
            
            //Checks if arrow is clickable and sets data
            if (data.onClick !== undefined) {
                this._clickable = true;
                data.sphereId = id;
                plane.userData.clickaction = {
                    type: data.onClick.type,
                    data: data
                }
            }
            plane.userData.belongsTo = id;
            plane.userData.id = name;
            plane.userData.type = "arrow";
            plane.name = "Arrow " + name;

            return this;
        },

        getArrow: function () {
            return this._arrow;
        },
        isClickable: function () {
            return this._clickable;
        }
    };

}(window));