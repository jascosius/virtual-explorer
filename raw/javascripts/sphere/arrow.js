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
        _name: null,
        _data: null,
        _id: null,
        _sphere: null,
        _clickable: false,

        init: function (id, name, data, sphere) {
            this._id = id;
            this._name = name;
            this._data = data;
            this._sphere = sphere;

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
            if (data.next_sphere !== undefined) {
                this._clickable = true;
                plane.userData.clickaction = {
                    type: "change_sphere",
                    data: {
                        this_sphere: id,
                        this_arrow: name,
                        this_long: long,
                        this_lat: lat,
                        next_sphere: data.next_sphere,
                        next_camera_long: data.next_camera_long
                    }
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