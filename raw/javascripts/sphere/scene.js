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

    sphere.Scene = {
        _scene: null,
        _camera: null,
        _sphere: null,
        _texture: [],
        _quadgeometry: null,
        _quadmaterial: null,

        init: function (sphereObj) {
            this._sphere = sphereObj;

            var rtTexture0 = this._texture[0] = new THREE.WebGLRenderTarget(sphereObj.getViewerSize().width, sphereObj.getViewerSize().height, {
                minFilter: THREE.LinearMipMapLinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat
            });
            rtTexture0.wrapS = rtTexture0.wrapT = THREE.RepeatWrapping;
            rtTexture0.repeat.set(1, -1);

            var rtTexture1 = this._texture[1] = rtTexture0.clone();

            // Main screen
            this._camera = new THREE.OrthographicCamera(sphereObj.getViewerSize().width / -2, sphereObj.getViewerSize().width / 2, sphereObj.getViewerSize().height / 2, sphereObj.getViewerSize().height / -2, -10000, 10000);
            this._camera.position.z = 1000;
            this._camera.scale.y = -1;
            this._quadgeometry = new THREE.PlaneGeometry(sphereObj.getViewerSize().width, sphereObj.getViewerSize().height);
            this._quadmaterial = new THREE.ShaderMaterial({
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

            this._quadmaterial.uniforms.mixRatio.value = 0;

            var quad = new THREE.Mesh(this._quadgeometry, this._quadmaterial);

            this._scene = new THREE.Scene();
            this._scene.add(quad);
            this._scene.add(this._camera);
            
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
        },
        setMixRatioValue: function (value) {
            this._quadmaterial.uniforms.mixRatio.value = value;
        }
    };

}(window));