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
        _id: null,
        _sphere: null,
        _clickable: false,

        init: function (id, data, sphere) {
            this._id = id;
            this._data = data;
            this._sphere = sphere;

            var info_texture = '/images/objects/info.png';
            var self = this;
            var texture = THREE.ImageUtils.loadTexture( info_texture, {}, function () {
                self._sphere.render();
            });
            var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true } );
            var sprite = this._info = new THREE.Sprite( material );
            if (data.onClick !== undefined) {
                this._clickable = true;
                data.sphereId = id;
                sprite.userData.clickaction = {
                    type: data.onClick.type,
                    data: data
                }
            }
            var lat = math.eval(data.lat);
            var long = math.eval(data.long);
            sprite.position.add(this._sphere.getCartesian(800,lat,long));
            sprite.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
            sprite.userData.belongsTo = id;
            sprite.userData.type = "info";

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