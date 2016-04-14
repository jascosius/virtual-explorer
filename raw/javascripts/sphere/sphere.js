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
        _clickableObjects: null,
        _activeSceneNumber: 0,
        _events: null,

        init: function (data, onReady, startAnimation) {
            self = this;
            self._data = data;
            self._onReady = onReady;
            self._startAnimation = startAnimation;
            self._container = $('#sphere');
            self._subScene = [];
            self._container.innerHTML = '';
            self._clickableObjects = [];

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

            self._events = Object.create(sphere.Events).init(self);

            var cubeReady = function() {
                self._renderer.render();
                self._onReady();
            };

            var cube = Object.create(sphere.Cube).init(self._data.id,self._data.images.cubemap[explore.config.resolutions[explore.config.res].cubemap].path,cubeReady);
            self._subScene[0].addCube(cube);

            var arrows = self._createArrows(self._data.id,self._data.arrows);
            self._addArrows(arrows, self._subScene[0].getScene());
            var infos = self._createInfos(self._data.id,self._data.infos);
            self._addInfos(infos,self._subScene[0].getScene());



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
        },
        getSubScene: function (i) {
            if(i === undefined) {
                return self._subScene[self._activeSceneNumber];
            }
            return self._subScene[i];
        },
        render: function () {
            self._renderer.render();
        },
        _createArrows: function (id, arrows) {
            var arrowsArray = [];
            for (var key in arrows) {
                var arrow = arrows[key];
                arrowsArray.push(Object.create(sphere.Arrow).init(id, key, arrow, self));
            }
            return arrowsArray;
        },
        _addArrows: function (arrowsArray, scene) {
            for(var i in arrowsArray) {
                var arrow = arrowsArray[i];
                scene.add(arrow.getArrow());
                if (arrow.isClickable()) {
                    self.addClickableObject(arrow.getArrow());
                }
            }
        },
        _createInfos: function (id, infos) {
            var infosArray = [];
            for (var key in infos) {
                var info = infos[key];
                infosArray.push(Object.create(sphere.Info).init(id, info, self));

            }
            return infosArray
        },
        _addInfos: function (infosArray, scene) {
            for(var i in infosArray) {
                var info = infosArray[i];
                scene.add(info.getInfo());
                if (info.isClickable()) {
                    self.addClickableObject(info.getInfo());
                }
            }
        },
        addClickableObject: function (obj) {
            self._clickableObjects.push(obj);
        },
        getClickableObjects: function () {
            return self._clickableObjects;
        },
        _toggleActiveSceneNumber: function () {
            self._activeSceneNumber = 1 - self._activeSceneNumber;
            return self._activeSceneNumber;
        },
        getActiveSceneNumber: function() {
            return self._activeSceneNumber;
        },
        getNonActiveSceneNumber: function() {
            return 1 - self._activeSceneNumber;
        },
        loadNewSphere: function (clickData) {
            self.getSubScene().deleteObjects(false);
            window.explore.startLoading();
            $.getJSON("/json/spheres/sphere_" + clickData.next_sphere + ".json", function (newData) {
                self._data = newData;
                self._toggleActiveSceneNumber();
                self._clickableObjects = [];

                var newLong = self.getSubScene().getLong();
                if (clickData.next_camera_long !== undefined) {
                    newLong = math.eval(clickData.next_camera_long);
                }
                if (newData.arrows !== undefined) {
                    for (var key in newData.arrows) {
                        var arrow = newData.arrows[key];
                        if (arrow.next_sphere == clickData.this_sphere) {
                            newLong = (math.eval(arrow.long) + Math.PI) % (2 * Math.PI);
                            break;
                        }
                    }
                }
                var newViewLong = newLong + (self.getSubScene(self.getNonActiveSceneNumber()).getLong() - math.eval(clickData.this_long));
                var newViewLat = self.getSubScene().getLat();
                if (clickData.next_camera_lat !== undefined) {
                    newViewLat = math.eval(clickData.next_camera_lat);
                }
                self.getSubScene().setLatLong(newViewLat, newViewLong);

                
                var cubeReady = function () {
                    var animationReady = function () {
                        self._addArrows(arrows,self.getSubScene().getScene());
                        self._addInfos(infos,self.getSubScene().getScene());
                        self.getSubScene(self.getNonActiveSceneNumber()).deleteObjects(true);
                    };
                    var animation = Object.create(sphere.Animation).init(self,self.getSubScene(self.getNonActiveSceneNumber()).getLong(),newLong,self._subScene[self.getNonActiveSceneNumber()].getCube(),self.getSubScene().getCube(),animationReady);
                    window.explore.stopLoading();
                    animation.animate();
                };

                var cube = Object.create(sphere.Cube).init(self._data.id,self._data.images.cubemap[explore.config.resolutions[explore.config.res].cubemap].path,cubeReady);
                self.getSubScene().addCube(cube);
                
                var url = location.pathname;
                var expectedUrl = "/sphere/" + newData.id;
                if (url !== expectedUrl) {
                    history.pushState({}, "Sphere", "/sphere/" + newData.id);
                }

                var arrows = self._createArrows(self._data.id,self._data.arrows);
                var infos = self._createInfos(self._data.id,self._data.infos);


                //
                // if (grid) {
                //     addGrid();
                // }
            });
        },
        removeEvents: function () {
            self._events.removeEvents();
        }


    };

}(window));

//explore.loadSphere('13bad6b1e478b951', true);