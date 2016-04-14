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

    sphere.Grid = {
        _sphere: null,

        _PARTS: 36,
        _LABELRATE: 3,
        _DISTANCE: 1000,

        init: function (sphere) {
            this._sphere = sphere;
            return this;
        },

        showGrid: function () {
            this._addGrid(0);
            this._addGrid(1);
            this._sphere.render();
        },
        removeGrid: function() {
            this._delGrid(0);
            this._delGrid(1);
            this._sphere.render();
        },
        _addGrid: function (index) {
            var step = 2 * Math.PI / this._PARTS;
            var dashed;
            var point1, point2;
            var degreej, degreei;
            var j, i;
            var grid = new THREE.Object3D();
            var label = new THREE.Object3D();
            var text;

            //latitude marker
            for (j = 0; j < this._PARTS / 4; j++) {
                degreej = j * step;
                dashed = true;
                if (j % this._LABELRATE === 0) {
                    dashed = false;
                    text = Math.ceil((degreej / (Math.PI / 2)) * 90) + '/90*π/2';
                    label.add(this._createGridLabel(text, this._DISTANCE - 10, degreej, 0, "#FF0000"));
                    label.add(this._createGridLabel(text, this._DISTANCE - 10, degreej, Math.PI, "#FF0000"));
                    if (j !== 0) {
                        label.add(this._createGridLabel('-' + text, this._DISTANCE - 10, -degreej, 0, "#FF0000"));
                        label.add(this._createGridLabel('-' + text, this._DISTANCE - 10, -degreej, Math.PI, "#FF0000"));
                    }
                }
                for (i = 0; i < this._PARTS; i++) {//for (i = 0; i < 2 * Math.PI-offset; i += step) {
                    degreei = i * step;
                    point1 = this._sphere.getCartesian(this._DISTANCE, degreej, degreei);
                    point2 = this._sphere.getCartesian(this._DISTANCE, degreej, degreei + step);
                    grid.add(this._buildGridLine(point1, point2, 0xFF0000, dashed));
                    if (j !== 0) {
                        point1 = this._sphere.getCartesian(this._DISTANCE, -degreej, degreei);
                        point2 = this._sphere.getCartesian(this._DISTANCE, -degreej, degreei + step);
                        grid.add(this._buildGridLine(point1, point2, 0xFF0000, dashed));
                    }
                }
            }

            //longitude marker
            for (j = 0; j < this._PARTS; j++) {
                degreej = j * step;
                dashed = true;
                if (j % this._LABELRATE === 0) {
                    dashed = false;
                    text = Math.ceil((degreej / (2 * Math.PI)) * 360) + '/360*2π';
                    label.add(this._createGridLabel(text, this._DISTANCE - 10, -this._LABELRATE * step / 2, degreej, "#00FF00"));
                }
                for (i = 1; i < this._PARTS / 4; i++) {//for (i = step; i < Math.PI/2-offset; i += step) {
                    degreei = i * step;
                    point1 = this._sphere.getCartesian(this._DISTANCE, degreei, degreej);
                    point2 = this._sphere.getCartesian(this._DISTANCE, degreei - step, degreej);
                    grid.add(this._buildGridLine(point1, point2, 0x00FF00, dashed));
                    point1 = this._sphere.getCartesian(this._DISTANCE, -degreei, degreej);
                    point2 = this._sphere.getCartesian(this._DISTANCE, -degreei + step, degreej);
                    grid.add(this._buildGridLine(point1, point2, 0x00FF00, dashed));
                }
            }

            grid.userData.type = "grid";
            label.userData.type = "grid";

            this._sphere.getSubScene(index).getScene().add(grid);
            this._sphere.getSubScene(index).getScene().add(label);
        },
        _createGridLabel: function (text, radius, lat, long, color) {
            var canvas1 = document.createElement('canvas');
            var context1 = canvas1.getContext('2d');
            var width = 270;
            var height = 90;
            canvas1.width = width;
            canvas1.height = height;
            context1.font = "50px Arial";
            context1.fillStyle = color;
            context1.fillText(text, 0, height);

            // canvas contents will be used for a texture
            var texture1 = new THREE.Texture(canvas1);
            texture1.needsUpdate = true;

            var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
            material1.transparent = true;

            var mesh1 = new THREE.Mesh(
                new THREE.PlaneGeometry(canvas1.width, canvas1.height),
                material1
            );
            mesh1.position.add(this._sphere.getCartesian(radius, lat, long));
            mesh1.rotation.y = Math.PI + long;
            if (long === 0) {
                mesh1.rotation.x = -lat;
            }
            if (long === Math.PI) {
                mesh1.rotation.x = lat;
            }
            mesh1.userData.type = "grid";
            return mesh1;
        },
        _buildGridLine: function (src, dst, colorHex, dashed) {
            var geom = new THREE.Geometry(),
                mat;

            if (dashed) {
                mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 10, gapSize: 10});
            } else {
                mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
            }

            geom.vertices.push(src.clone());
            geom.vertices.push(dst.clone());
            geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

            var line = new THREE.Line(geom, mat, THREE.LinePieces);
            line.userData.type = "grid";

            return line;

        },
        _delGrid: function (index) {
            var scene = this._sphere.getSubScene(index).getScene();
            for (var i = 0; i < scene.children.length;) {
                var object = scene.children[i];
                var type = object.userData.type;
                if (type !== undefined && type !== null && type === "grid") {
                    scene.remove(object);
                } else {
                    i++;
                }
            }
        }

    };

}(window));