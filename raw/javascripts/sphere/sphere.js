/**
 * The main class to handle the sphere
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

        /**
         * Initializes a sphere object
         * @param data {object} - JavaScript object corresponding to the JSON which describes the sphere
         * @param onReady {object} - Call if sphere is loaded
         * @param startAnimation - Should the enter of the sphere be animated
         * @returns {window.explore.sphere.Sphere}
         */
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
                window.location = "/error/canvas";
            }

            //Create the three scenes and the renderer
            sphere.scene = Object.create(sphere.Scene).init(this);
            this._subScene[0] = Object.create(sphere.SubScene).init(this);
            this._subScene[1] = Object.create(sphere.SubScene).init(this);

            this._renderer = Object.create(sphere.Renderer).init(this,this._subScene[0],this._subScene[1]);

            var canvas = this._renderer.getDomElement();
            canvas.style.display = 'block';
            this._container.append(canvas);

            this.fitToContainer();

            this._events = Object.create(sphere.Events).init(this);

            //Create the cube to show the sphere
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
                        var openSphereAnimation = Object.create(sphere.OpenSphereAnimation).init(self, null, null,initial, self.getSubScene().getCube(), false, animationReady);
                        openSphereAnimation.animate();
                    } else {
                        self.getSubScene().setLatLong(0, initial);
                        animationReady();
                    }
                }
            };
            var cube = Object.create(sphere.Cube).init(this._data.id,this._data,cubeReady);
            this._subScene[0].addCube(cube);

            //Create the arrows and the info marker for the sphere
            var arrows = this._createArrows(this._data.id,this._data.arrows);
            var infos = this._createInfos(this._data.id,this._data.infos);
            
            this._grid = Object.create(sphere.Grid).init(this);

            this._renderer.render();

            return this;
        },
        /**
         * Returns if canvas is supported
         * @returns {boolean}
         * @private
         */
        _isCanvasSupported: function () {
            var canvas = window.document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        /**
         * Returns the size and ratio of the viewer
         * @returns {object}
         */
        getViewerSize: function () {
            return this._viewerSize;
        },
        /**
         * Converts sphere coordinates into cartesian coordinates
         * @param radius {number} - distance from the middle point
         * @param lat {number} - latitude of the point
         * @param long {number} - longitude of the point
         * @returns {THREE.Vector3}
         */
        getCartesian: function (radius, lat, long) {
            var x = radius * Math.cos(lat) * Math.sin(long);
            var y = radius * Math.sin(lat);
            var z = radius * Math.cos(lat) * Math.cos(long);
            return new THREE.Vector3(x, y, z);
        },
        /**
         * Call if view size changes
         * Updates the size
         */
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
        /**
         * Get the map this sphere belongs to
         * @param i {number} - index of the map (if more then one)
         * @returns {string}
         */
        getMap: function (i) {
            return this._data.belongsToMap[i];
        },
        /**
         * Get the i. sub scene. Returns the active sub scene if i = null
         * @param i
         * @returns {object}
         */
        getSubScene: function (i) {
            if(i == null) {
                return this._subScene[this._activeSceneNumber];
            }
            return this._subScene[i];
        },
        /**
         * Render the scenes
         */
        render: function () {
            this._renderer.render();
        },
        /**
         * Creates arrows for the sphere
         * @param id {string} - ID of the sphere
         * @param arrows {object} - JavaScript object corresponding with the JSON describing the arrow
         * @returns {Array} - array of arrows
         * @private
         */
        _createArrows: function (id, arrows) {
            var arrowsArray = [];
            for (var key in arrows) {
                if (arrows.hasOwnProperty(key)) {
                    var arrow = arrows[key];
                    arrowsArray.push(Object.create(sphere.Arrow).init(id, key, arrow, this));
                }
            }
            return arrowsArray;
        },
        /**
         * Adds arrows to the scene (and to the clickable objects if necessary)
         * @param arrowsArray {Array} - array of arrows
         * @param scene {object} - scene to add arrows
         * @private
         */
        _addArrows: function (arrowsArray, scene) {
            for(var i in arrowsArray) {
                if(arrowsArray.hasOwnProperty(i)) {
                    var arrow = arrowsArray[i];
                    scene.add(arrow.getArrow());
                    if (arrow.isClickable()) {
                        this.addClickableObject(arrow.getArrow());
                    }
                }
            }
        },
        /**
         * Creates info marker for the sphere
         * @param id {string} - ID of the sphere
         * @param infos {object} - JavaScript object corresponding with the JSON describing the info marker
         * @returns {Array} - array of info marker
         * @private
         */
        _createInfos: function (id, infos) {
            var infosArray = [];
            for (var key in infos) {
                if (infos.hasOwnProperty(key)) {
                    var info = infos[key];
                    infosArray.push(Object.create(sphere.Info).init(id, key, info, this));

                }
            }
            return infosArray
        },
        /**
         * Adds info marker to the scene (and to the clickable objects if necessary)
         * @param infosArray {Array} - array of info marker
         * @param scene {object} - scene to add info marker
         * @private
         */
        _addInfos: function (infosArray, scene) {
            for(var i in infosArray) {
                if(infosArray.hasOwnProperty(i)) {
                    var info = infosArray[i];
                    scene.add(info.getInfo());
                    if (info.isClickable()) {
                        this.addClickableObject(info.getInfo());
                    }
                }
            }
        },
        /**
         * Adds an object to the clickable objects
         * @param obj {object} - the object to add
         */
        addClickableObject: function (obj) {
            this._clickableObjects.push(obj);
        },
        /**
         * Returns all clickable objects
         * @returns {Array}
         */
        getClickableObjects: function () {
            return this._clickableObjects;
        },
        /**
         * Toggles the sub scene
         * @returns {number} - the new scene number
         * @private
         */
        _toggleActiveSceneNumber: function () {
            this._activeSceneNumber = 1 - this._activeSceneNumber;
            return this._activeSceneNumber;
        },
        /**
         * Returns the number of the active sub scene
         * @returns {number}
         */
        getActiveSceneNumber: function() {
            return this._activeSceneNumber;
        },
        /**
         * Returns the number of the non active sub scene
         * @returns {number}
         */
        getNonActiveSceneNumber: function() {
            return 1 - this._activeSceneNumber;
        },
        /**
         * Loads an new sphere
         * @param clickData {object} - data provided by the onClick event of type newSphere
         */
        loadNewSphere: function (clickData) {
            explore.loadingData.id = clickData.onClick.nextSphere;
            explore.loadingData.type = "sphere";
            //Delete all objects in the active scene exepts the cube
            this.getSubScene().deleteObjects(false);
            window.explore.startLoading();
            $.getJSON("/json/spheres/sphere_" + clickData.onClick.nextSphere + ".json", function (newData) {
                //Update data and scene number and delete clickable objects
                this._data = newData;
                this._toggleActiveSceneNumber();
                this._clickableObjects = [];

                //Calculate the camera longitude in the new sphere depending on the old view
                var newLong = this.getSubScene().getLong();
                if (clickData.onClick.nextCameraLong !== undefined) {
                    newLong = math.eval(clickData.onClick.nextCameraLong);
                }
                if (newData.arrows !== undefined) {
                    for (var key in newData.arrows) {
                        if(newData.arrows.hasOwnProperty(key)) {
                            var arrow = newData.arrows[key];
                            if (arrow.onClick != null && arrow.onClick.nextSphere == clickData.sphereId) {
                                newLong = (math.eval(arrow.long) + Math.PI) % (2 * Math.PI);
                                break;
                            }
                        }
                    }
                }
                var newViewLong = newLong + (this.getSubScene(this.getNonActiveSceneNumber()).getLong() - math.eval(clickData.long));
                var newViewLat = this.getSubScene().getLat();
                if (clickData.onClick.nextCameraLat !== undefined) {
                    newViewLat = math.eval(clickData.onClick.nextCameraLat);
                }
                this.getSubScene().setLatLong(newViewLat, newViewLong);

                //Create the new cube
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
                        var oldCube = self.getSubScene(self.getNonActiveSceneNumber()).getCube();
                        var newCube = self.getSubScene().getCube();
                        var animation = Object.create(sphere.Animation).init(self,math.eval(clickData.long),newLong,oldCube,newCube,animationReady);
                        window.explore.stopLoading();
                        history.pushState({type: 'sphere', id: newData.id}, "Sphere", "/sphere/" + newData.id);
                        animation.animate();
                    }
                };

                this.getSubScene().addCube(null);
                var cube = Object.create(sphere.Cube).init(this._data.id,this._data,cubeReady);
                this.getSubScene().addCube(cube);

                //Create the arrows and info marker
                var arrows = this._createArrows(this._data.id,this._data.arrows);
                var infos = this._createInfos(this._data.id,this._data.infos);
                
            }.bind(this));
        },
        /**
         * remove all Events which belongs to the sphere view
         */
        removeEvents: function () {
            this._events.removeEvents();
        },
        /**
         * Show a grid to held adjusting arrows and info marker
         */
        showGrid: function () {
            this._grid.showGrid();
        },
        /**
         * Remove the grid
         */
        removeGrid: function () {
            this._grid.removeGrid();
        }


    };

}(window));

//explore.loadSphere('13bad6b1e478b951', true);