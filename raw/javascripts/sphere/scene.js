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

    sphere.Scene = {
        _scene: null,
        _camera: null,
        _sphere: null,
        _texture: [],

        init: function (sphere) {
            var self = this;
            self._sphere = sphere;
            var rtTexture0 = self._texture[0] = new THREE.WebGLRenderTarget(sphere.getViewerSize().width, sphere.getViewerSize().height, {
                minFilter: THREE.LinearMipMapLinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat
            });
            rtTexture0.wrapS = rtTexture0.wrapT = THREE.RepeatWrapping;
            rtTexture0.repeat.set(1, -1);

            var rtTexture1 = self._texture[1] = rtTexture0.clone();

            // Main screen
            self._camera = new THREE.OrthographicCamera(sphere.getViewerSize().width / -2, sphere.getViewerSize().width / 2, sphere.getViewerSize().height / 2, sphere.getViewerSize().height / -2, -10000, 10000);
            self._camera.position.z = 1000;
            self._camera.scale.y = -1;
            var quadgeometry = new THREE.PlaneGeometry(sphere.getViewerSize().width, sphere.getViewerSize().height);
            var quadmaterial = new THREE.ShaderMaterial({
                side: THREE.BackSide,

                uniforms: {

                    tDiffuse1: {
                        type: "t",
                        value: rtTexture0
                    },
                    tDiffuse2: {
                        type: "t",
                        value: rtTexture1
                    },
                    mixRatio: {
                        type: "f",
                        value: 0.5
                    },
                    opacity: {
                        type: "f",
                        value: 1.0
                    }

                },
                vertexShader: [

                    "varying vec2 vUv;",

                    "void main() {",

                    "vUv = vec2( uv.x, 1.0 - uv.y );",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                    "}"

                ].join("\n"),
                fragmentShader: [

                    "uniform float opacity;",
                    "uniform float mixRatio;",

                    "uniform sampler2D tDiffuse1;",
                    "uniform sampler2D tDiffuse2;",

                    "varying vec2 vUv;",

                    "void main() {",

                    "vec4 texel1 = texture2D( tDiffuse1, vUv );",
                    "vec4 texel2 = texture2D( tDiffuse2, vUv );",
                    "gl_FragColor = opacity * mix( texel1, texel2, mixRatio );",

                    "}"

                ].join("\n")

            });

            quadmaterial.uniforms.mixRatio.value = 0.5;

            var quad = new THREE.Mesh(quadgeometry, quadmaterial);

            self._scene = new THREE.Scene();
            self._scene.add(quad);
            self._scene.add(self._camera);
            
            return this;
        },
        getTexture: function (i) {
            return this._texture[i];
        },
        getScene: function () {
            return this._scene;
        },
        getCamera: function () {
            return this._camera;
        }
    };

}(window));