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
    var self = null;

    sphere.Sphere = {

        _data: null,
        _onReady: null,
        _startAnimation: null,
        _container: null,
        // Current viewer size
        _viewerSize: {
            width: 0,
            height: 0,
            ratio: 0
        },
        _renderer: null,
        _actualIndex: 0,
        _subScene: null,

        init: function (data, onReady, startAnimation) {
            self = this;
            self._data = data;
            self._onReady = onReady;
            self._startAnimation = startAnimation;
            self._container = $('#sphere');
            self._subScene = [];
            self._container.innerHTML = '';

            // Is canvas supported?
            if (!self._isCanvasSupported()) {
                self._container.textContent = 'Canvas is not supported, update your browser!';
                self._onReady();
                return;
            }

            // Is Three.js loaded?
            if (window.THREE === undefined) {
                console.log('PhotoSphereViewer: Three.js is not loaded.');
                self._onReady();
                return;
            }

            sphere.scene = Object.create(sphere.Scene).init(self);
            self._subScene[0] = Object.create(sphere.SubScene).init(self);
            self._subScene[1] = Object.create(sphere.SubScene).init(self);

            self._renderer = Object.create(sphere.Renderer).init(self,self._subScene[0],self._subScene[1]);

            var canvas = self._renderer.getDomElement();
            canvas.style.display = 'block';
            self._container.append(canvas);

            self.fitToContainer();

            var events = Object.create(sphere.Events).init(self);

            var cubeReady = function() {
                self._renderer.render();
                self._onReady();
            };

            var cube = Object.create(sphere.Cube).init(self._data.id,self._data.images.cubemap['2048'].path,cubeReady);
            self._subScene[0].getScene().add(cube.getCube());

            self._renderer.render();

            return self;
        },
        _isCanvasSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        getViewerSize: function () {
            return self._viewerSize;
        },
        getCartesian: function (radius, lat, long) {
            var x = radius * Math.cos(lat) * Math.sin(long);
            var y = radius * Math.sin(lat);
            var z = radius * Math.cos(lat) * Math.cos(long);
            return new THREE.Vector3(x, y, z);
        },
        fitToContainer: function () {
            var container = self._container;
            var viewerSize = self._viewerSize;
            if (container.width() != viewerSize.width || container.height() != viewerSize.height) {
                viewerSize.width = parseInt(container.width());
                viewerSize.height = parseInt(container.height());
                viewerSize.ratio = viewerSize.width / viewerSize.height;

                sphere.scene = Object.create(sphere.Scene).init(self);
                self._subScene[0].updateSize();
                self._subScene[1].updateSize();
                self._renderer.updateSize()
            }
        },
        getMap: function (i) {
            return self._data.belongsToMap[i];
        }


    };

}(window));

//explore.loadSphere('13bad6b1e478b951', true);