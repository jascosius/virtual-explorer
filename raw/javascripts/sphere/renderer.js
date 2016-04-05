(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var explore = window.explore;
    var sphere = window.explore.sphere;
    var document = window.document;
    var $ = window.$;

    sphere.Renderer = {
        _sphere: null,
        _renderer: null,
        _subScene: [],
        _scene: null,
        init: function (sphere,scene,subScene0,subScene1) {
            var self = this;
            self._sphere = sphere;
            self._scene = scene;
            self._subScene[0] = subScene0;
            self._subScene[1] = subScene1;

            self._renderer = (self._isWebGLSupported()) ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
            self._renderer.setSize(sphere.getViewerSize().width, sphere.getViewerSize().height);
            
            return this;
        },
        getDomElement: function () {
            return this._renderer.domElement;
        },
        _isWebGLSupported: function () {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        },
        render: function () {
            var self = this;

            self._renderer.render(self._subScene[0].getScene(), self._subScene[0].getCamera(), self._scene.getTexture(0));
            self._renderer.render(self._subScene[1].getScene(), self._subScene[1].getCamera(), self._scene.getTexture(1));
            self._renderer.render(self._scene.getScene(), self._scene.getCamera(), null, true);
        }
    };

}(window));