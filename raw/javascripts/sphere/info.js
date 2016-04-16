/**
 * Class to handle info marker shown in a sphere
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

    sphere.Info = {
        _info: null,
        _data: null,
        _id: "",
        _name: "",
        _sphere: null,
        _clickable: false,

        /**
         * Initializes an info marker
         * @param id {string} - ID of the sphere which holds this info marker
         * @param name {string} - Name (number) of this info marker
         * @param data {object} - JavaScript object corresponding to the JSON description of this info marker
         * @param sphere {Sphere} - sphere object
         * @returns {window.explore.sphere.Info}
         */
        init: function (id, name, data, sphere) {
            this._id = id;
            this._name = name;
            this._data = data;
            this._sphere = sphere;

            //Sets defaults or values found in 'data'
            var size = 60;
            if (data.size !== undefined)
                size = math.eval(data.size);
            var info_texture = '/images/objects/info.png';
            if (data.texture !== undefined)
                info_texture = data.texture;
            var lat = math.eval(data.lat);
            var long = math.eval(data.long);

            //Initializes the three.js object for this info marker
            var self = this;
            var texture = THREE.ImageUtils.loadTexture( info_texture, {}, function () {
                self._sphere.render();
            });
            var material = new THREE.SpriteMaterial( { map: texture} );
            var sprite = this._info = new THREE.Sprite( material );

            sprite.position.add(this._sphere.getCartesian(800,lat,long));
            sprite.scale.set( size, size, 1.0 );

            //Checks if info marker is clickable and sets data
            if (data.onClick !== undefined) {
                this._clickable = true;
                data.sphereId = id;
                sprite.userData.clickaction = {
                    type: data.onClick.type,
                    data: data
                }
            }
            sprite.userData.belongsTo = id;
            sprite.userData.id = name;
            sprite.userData.type = "info";
            sprite.name = "Info " + name;

            return this;
        },

        getInfo: function () {
            return this._info;
        },
        isClickable: function () {
            return this._clickable;
        }
    };

}(window));