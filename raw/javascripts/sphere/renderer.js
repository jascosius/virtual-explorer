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

    sphere.Renderer = {
        _sphere: null,
        _renderer: null,
        _subScene: [],
        init: function (sphereObj, subScene0, subScene1) {
            this._sphere = sphereObj;
            this._subScene[0] = subScene0;
            this._subScene[1] = subScene1;


            if (this._isWebGLSupported()) {
                this._renderer = new THREE.WebGLRenderer()
            } else {
                window.location = "/error/webgl";
            }
            this.updateSize();

            return this;
        },
        getDomElement: function () {
            return this._renderer.domElement;
        },
        _isWebGLSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        },
        render: function () {
            var scene = sphere.scene;
            this._renderer.render(this._subScene[0].getScene(), this._subScene[0].getCamera(), scene.getTexture(0));
            this._renderer.render(this._subScene[1].getScene(), this._subScene[1].getCamera(), scene.getTexture(1));
            this._renderer.render(sphere.scene.getScene(), scene.getCamera(), null, true);
        },
        updateSize: function () {
            this._renderer.setSize(this._sphere.getViewerSize().width, this._sphere.getViewerSize().height);
            this.render();
        }
    };

}(window));