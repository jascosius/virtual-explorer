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
        _grid: null,

        init: function (data, onReady, startAnimation) {
            this._data = data;
            this._onReady = onReady;
            this._startAnimation = startAnimation;
            this._container = $('#sphere');
            this._subScene = [];
            this._container.innerHTML = '';
            this._clickableObjects = [];

            // Is canvas supported?
            if (!this._isCanvasSupported()) {
                this._container.textContent = 'Canvas is not supported, update your browser!';
                this._onReady();
                return;
            }

            // Is Three.js loaded?
            if (window.THREE === undefined) {
                console.log('PhotoSphereViewer: Three.js is not loaded.');
                this._onReady();
                return;
            }

            sphere.scene = Object.create(sphere.Scene).init(this);
            this._subScene[0] = Object.create(sphere.SubScene).init(this);
            this._subScene[1] = Object.create(sphere.SubScene).init(this);

            this._renderer = Object.create(sphere.Renderer).init(this,this._subScene[0],this._subScene[1]);

            var canvas = this._renderer.getDomElement();
            canvas.style.display = 'block';
            this._container.append(canvas);

            this.fitToContainer();

            this._events = Object.create(sphere.Events).init(this);

            var self = this;
            var animationReady = function () {
                self._addArrows(arrows,self.getSubScene().getScene());
                self._addInfos(infos,self.getSubScene().getScene());
                self._renderer.render();
            };
            var cubeReady = function() {
                if(self.getSubScene().getCube() == null) {
                    setTimeout(cubeReady, 100);
                } else {
                    self._onReady();
                    var initial = 0;
                    if (self._data.initialView.long !== undefined) {
                        initial = math.eval(self._data.initialView.long);
                    }
                    if(startAnimation) {
                        var openSphereAnimation = Object.create(sphere.OpenSphereAnimation).init(self, initial, self.getSubScene().getCube(), false, animationReady);
                        openSphereAnimation.animate();
                    } else {
                        self.getSubScene().setLatLong(0, initial);
                        animationReady();
                    }
                }
            };

            var cube = Object.create(sphere.Cube).init(this._data.id,this._data,cubeReady);
            this._subScene[0].addCube(cube);

            var cubeReady = function () {
                if(self.getSubScene().getCube() == null) {
                    setTimeout(cubeReady, 100);
                } else {
                    var animation = Object.create(sphere.Animation).init(self,self.getSubScene(self.getNonActiveSceneNumber()).getLong(),newLong,self._subScene[self.getNonActiveSceneNumber()].getCube(),self.getSubScene().getCube(),animationReady);
                    window.explore.stopLoading();
                    history.pushState({type: 'sphere', id: newData.id}, "Sphere", "/sphere/" + newData.id);
                    animation.animate();
                }
            };

            var arrows = this._createArrows(this._data.id,this._data.arrows);
            //this._addArrows(arrows, this._subScene[0].getScene());
            var infos = this._createInfos(this._data.id,this._data.infos);
            //this._addInfos(infos,this._subScene[0].getScene());
            
            this._grid = Object.create(sphere.Grid).init(this);

            this._renderer.render();

            return this;
        },
        _isCanvasSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        getViewerSize: function () {
            return this._viewerSize;
        },
        getCartesian: function (radius, lat, long) {
            var x = radius * Math.cos(lat) * Math.sin(long);
            var y = radius * Math.sin(lat);
            var z = radius * Math.cos(lat) * Math.cos(long);
            return new THREE.Vector3(x, y, z);
        },
        fitToContainer: function () {
            var container = this._container;
            var viewerSize = this._viewerSize;
            if (container.width() != viewerSize.width || container.height() != viewerSize.height) {
                viewerSize.width = parseInt(container.width());
                viewerSize.height = parseInt(container.height());
                viewerSize.ratio = viewerSize.width / viewerSize.height;

                sphere.scene = Object.create(sphere.Scene).init(this);
                this._subScene[0].updateSize();
                this._subScene[1].updateSize();
                this._renderer.updateSize()
            }
        },
        getMap: function (i) {
            return this._data.belongsToMap[i];
        },
        getSubScene: function (i) {
            if(i == null) {
                return this._subScene[this._activeSceneNumber];
            }
            return this._subScene[i];
        },
        render: function () {
            this._renderer.render();
        },
        _createArrows: function (id, arrows) {
            var arrowsArray = [];
            for (var key in arrows) {
                var arrow = arrows[key];
                arrowsArray.push(Object.create(sphere.Arrow).init(id, key, arrow, this));
            }
            return arrowsArray;
        },
        _addArrows: function (arrowsArray, scene) {
            for(var i in arrowsArray) {
                var arrow = arrowsArray[i];
                scene.add(arrow.getArrow());
                if (arrow.isClickable()) {
                    this.addClickableObject(arrow.getArrow());
                }
            }
        },
        _createInfos: function (id, infos) {
            var infosArray = [];
            for (var key in infos) {
                var info = infos[key];
                infosArray.push(Object.create(sphere.Info).init(id, info, this));

            }
            return infosArray
        },
        _addInfos: function (infosArray, scene) {
            for(var i in infosArray) {
                var info = infosArray[i];
                scene.add(info.getInfo());
                if (info.isClickable()) {
                    this.addClickableObject(info.getInfo());
                }
            }
        },
        addClickableObject: function (obj) {
            this._clickableObjects.push(obj);
        },
        getClickableObjects: function () {
            return this._clickableObjects;
        },
        _toggleActiveSceneNumber: function () {
            this._activeSceneNumber = 1 - this._activeSceneNumber;
            return this._activeSceneNumber;
        },
        getActiveSceneNumber: function() {
            return this._activeSceneNumber;
        },
        getNonActiveSceneNumber: function() {
            return 1 - this._activeSceneNumber;
        },
        loadNewSphere: function (clickData) {
            explore.loadingData.id = clickData.next_sphere;
            explore.loadingData.type = "sphere";
            this.getSubScene().deleteObjects(false);
            window.explore.startLoading();
            $.getJSON("/json/spheres/sphere_" + clickData.next_sphere + ".json", function (newData) {
                this._data = newData;
                this._toggleActiveSceneNumber();
                this._clickableObjects = [];

                var newLong = this.getSubScene().getLong();
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
                var newViewLong = newLong + (this.getSubScene(this.getNonActiveSceneNumber()).getLong() - math.eval(clickData.this_long));
                var newViewLat = this.getSubScene().getLat();
                if (clickData.next_camera_lat !== undefined) {
                    newViewLat = math.eval(clickData.next_camera_lat);
                }
                this.getSubScene().setLatLong(newViewLat, newViewLong);

                var self = this;
                var animationReady = function () {
                    self._addArrows(arrows,self.getSubScene().getScene());
                    self._addInfos(infos,self.getSubScene().getScene());
                    self.getSubScene(self.getNonActiveSceneNumber()).deleteObjects(true);
                };
                var cubeReady = function () {
                    if(self.getSubScene().getCube() == null) {
                        setTimeout(cubeReady, 100);
                    } else {
                        var animation = Object.create(sphere.Animation).init(self,self.getSubScene(self.getNonActiveSceneNumber()).getLong(),newLong,self._subScene[self.getNonActiveSceneNumber()].getCube(),self.getSubScene().getCube(),animationReady);
                        window.explore.stopLoading();
                        history.pushState({type: 'sphere', id: newData.id}, "Sphere", "/sphere/" + newData.id);
                        animation.animate();
                    }
                };

                var cube = Object.create(sphere.Cube).init(this._data.id,this._data,cubeReady);
                this.getSubScene().addCube(cube);

                var arrows = this._createArrows(this._data.id,this._data.arrows);
                var infos = this._createInfos(this._data.id,this._data.infos);


                //
                // if (grid) {
                //     addGrid();
                // }
            }.bind(this));
        },
        removeEvents: function () {
            this._events.removeEvents();
        },
        showGrid: function () {
            this._grid.showGrid();
        },
        removeGrid: function () {
            this._grid.removeGrid();
        }


    };

}(window));

//explore.loadSphere('13bad6b1e478b951', true);