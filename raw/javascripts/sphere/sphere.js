(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    window.console.log('sphere.js');
    var explore = window.explore;
    var sphere = window.explore.sphere;
    var document = window.document;
    var $ = window.$;

    sphere.Sphere = {
        _data: null,
        _container: null,
        _onReady: null,
        _startAnimation: null,
        // Current viewer size
        _viewer_size: {
            width: 0,
            height: 0,
            ratio: 0
        },

        init: function (data, container, onReady, startAnimation) {
            this._data = data;
            this._container = container;
            this._onReady = onReady;
            this._startAnimation = startAnimation;
            this.load();
        },
        _isCanvasSupported: function () {
            var canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        _isWebGLSupported: function () {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        },
        load: function () {
            this.container.innerHTML = '';
            alert('Main');

            // Is canvas supported?
            if (!this._isCanvasSupported()) {
                this.container.textContent = 'Canvas is not supported, update your browser!';
                return;
            }

            // Is Three.js loaded?
            if (window.THREE === undefined) {
                console.log('PhotoSphereViewer: Three.js is not loaded.');
                return;
            }

        }


    };

}(window));

//explore.loadSphere('13bad6b1e478b951', true);