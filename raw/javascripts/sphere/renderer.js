/**
 * Class to handle the renderer
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

    sphere.Renderer = {
        _sphere: null,
        _renderer: null,
        _subScene: [],

        /**
         * Initializes a renderer object
         * @param sphereObj {Sphere} - sphere object
         * @param subScene0 {SubScene} - the 0. sub scene
         * @param subScene1 {SubScene} - the 1. sub scene
         * @returns {window.explore.sphere.Renderer}
         */
        init: function (sphereObj, subScene0, subScene1) {
            this._sphere = sphereObj;
            this._subScene[0] = subScene0;
            this._subScene[1] = subScene1;

            //redirect if WebGL is not supported
            if (this._isWebGLSupported()) {
                this._renderer = new THREE.WebGLRenderer();
            } else {
                window.location = "/error/webgl";
            }
            this.updateSize();

            return this;
        },
        /**
         * Returns the DOM Element of the renderer
         * @returns {object}
         */
        getDomElement: function () {
            return this._renderer.domElement;
        },
        /**
         * Is WebGL supported
         * @returns {boolean}
         * @private
         */
        _isWebGLSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(window.WebGLRenderingContext);
        },
        /**
         * Render the scenes
         */
        render: function () {
            //Render both sub scenes onto a texture
            //Render the final image
            var scene = sphere.scene;
            this._renderer.render(this._subScene[0].getScene(), this._subScene[0].getCamera(), scene.getTexture(0));
            this._renderer.render(this._subScene[1].getScene(), this._subScene[1].getCamera(), scene.getTexture(1));
            this._renderer.render(sphere.scene.getScene(), scene.getCamera(), null, true);
        },
        /**
         * Update size scene
         */
        updateSize: function () {
            this._renderer.setSize(this._sphere.getViewerSize().width, this._sphere.getViewerSize().height);
            this.render();
        }
    };

}(window));