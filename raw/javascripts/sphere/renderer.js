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

    sphere.Renderer = {
        _sphere: null,
        _renderer: null,
        _subScene: [],
        init: function (sphereObj,subScene0,subScene1) {
            self = this;
            self._sphere = sphereObj;
            self._subScene[0] = subScene0;
            self._subScene[1] = subScene1;

            self._renderer = (self._isWebGLSupported()) ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
            self.updateSize();
            
            return self;
        },
        getDomElement: function () {
            return self._renderer.domElement;
        },
        _isWebGLSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        },
        render: function () {
            var scene = sphere.scene;
            self._renderer.render(self._subScene[0].getScene(), self._subScene[0].getCamera(), scene.getTexture(0));
            //self._renderer.render(self._subScene[0].getScene(), self._subScene[0].getCamera(), null, true);

            self._renderer.render(self._subScene[1].getScene(), self._subScene[1].getCamera(), scene.getTexture(1));
            self._renderer.render(sphere.scene.getScene(), scene.getCamera(), null, true);
        },
        updateSize: function () {
            self._renderer.setSize(self._sphere.getViewerSize().width, self._sphere.getViewerSize().height);
            self.render();
        }
    };

}(window));