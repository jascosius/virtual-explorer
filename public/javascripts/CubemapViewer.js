/*
 * Photo Sphere Viewer v2.4.1
 * http://jeremyheleine.me/photo-sphere-viewer
 *
 * Copyright (c) 2014,2015 Jérémy Heleine
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Represents a panorama viewer.
 * @class
 * @param {object} args - Settings to apply to the viewer
 * @param {object} args.data - Data with Panorama Details
 * @param {object} args.image.cubemap - Path to Panorama Cubemap images
 * @param {HTMLElement} args.container - Panorama container (should be a `div` or equivalent)
 * @param {boolean} [args.autoload=true] - `true` to automatically load the panorama, `false` to load it later (with the {@link PhotoSphereViewer#load|`.load`} method)
 * @param {number|string} [args.default_position.long=0] - Default longitude, in radians (or in degrees if indicated, e.g. `'45deg'`)
 * @param {number|string} [args.default_position.lat=0] - Default latitude, in radians (or in degrees if indicated, e.g. `'45deg'`)
 * @param {number} [args.min_fov=30] - The minimal field of view, in degrees, between 1 and 179
 * @param {number} [args.max_fov=90] - The maximal field of view, in degrees, between 1 and 179
 * @param {boolean} [args.allow_user_interactions=true] - If set to `false`, the user won't be able to interact with the panorama (navigation bar is then disabled)
 * @param {number|string} [args.tilt_up_max=π/2] - The maximal tilt up angle, in radians (or in degrees if indicated, e.g. `'30deg'`)
 * @param {number|string} [args.tilt_down_max=π/2] - The maximal tilt down angle, in radians (or in degrees if indicated, e.g. `'30deg'`)
 * @param {number|string} [args.min_longitude=0] - The minimal longitude to show
 * @param {number|string} [args.max_longitude=2π] - The maximal longitude to show
 * @param {number} [args.zoom_level=0] - The default zoom level, between 0 and 100
 * @param {number} [args.long_offset=π/360] - The longitude to travel per pixel moved by mouse/touch
 * @param {number} [args.lat_offset=π/180] - The latitude to travel per pixel moved by mouse/touch
 * @param {integer} [args.time_anim=2000] - Delay before automatically animating the panorama in milliseconds, `false` to not animate
 * @param {boolean} [args.reverse_anim=true] - `true` if horizontal animation must be reversed when min/max longitude is reached (only if the whole circle is not described)
 * @param {string} [args.anim_speed=2rpm] - Animation speed in radians/degrees/revolutions per second/minute
 * @param {string} [args.vertical_anim_speed=2rpm] - Vertical animation speed in radians/degrees/revolutions per second/minute
 * @param {number|string} [args.vertical_anim_target=0] - Latitude to target during the autorotate animation, default to the equator
 * @param {boolean} [args.navbar=false] - Display the navigation bar if set to `true`
 * @param {object} [args.navbar_style] - Style of the navigation bar
 * @param {string} [args.navbar_style.backgroundColor=rgba(61, 61, 61, 0.5)] - Navigation bar background color
 * @param {string} [args.navbar_style.buttonsColor=rgba(255, 255, 255, 0.7)] - Buttons foreground color
 * @param {string} [args.navbar_style.buttonsBackgroundColor=transparent] - Buttons background color
 * @param {string} [args.navbar_style.activeButtonsBackgroundColor=rgba(255, 255, 255, 0.1)] - Active buttons background color
 * @param {number} [args.navbar_style.buttonsHeight=20] - Buttons height in pixels
 * @param {number} [args.navbar_style.autorotateThickness=1] - Autorotate icon thickness in pixels
 * @param {number} [args.navbar_style.zoomRangeWidth=50] - Zoom range width in pixels
 * @param {number} [args.navbar_style.zoomRangeThickness=1] - Zoom range thickness in pixels
 * @param {number} [args.navbar_style.zoomRangeDisk=7] - Zoom range disk diameter in pixels
 * @param {number} [args.navbar_style.fullscreenRatio=4/3] - Fullscreen icon ratio (width/height)
 * @param {number} [args.navbar_style.fullscreenThickness=2] - Fullscreen icon thickness in pixels
 * @param {string} [args.loading_msg=Loading…] - Loading message
 * @param {string} [args.loading_img=null] - Loading image URL or path (absolute or relative)
 * @param {HTMLElement|string} [args.loading_html=null] - An HTML loader (element to append to the container or string representing the HTML)
 * @param {object} [args.size] - Final size of the panorama container (e.g. {width: 500, height: 300})
 * @param {(number|string)} [args.size.width] - Final width in percentage (e.g. `'50%'`) or pixels (e.g. `500` or `'500px'`) ; default to current width
 * @param {(number|string)} [args.size.height] - Final height in percentage or pixels ; default to current height
 * @param {PhotoSphereViewer~onReady} [args.onready] - Function called once the panorama is ready and the first image is displayed
 **/

var CubemapViewer = function (args) {
    /**
     * Detects whether canvas is supported.
     * @private
     * @return {boolean} `true` if canvas is supported, `false` otherwise
     **/

    var isCanvasSupported = function () {
        var canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    };

    /**
     * Detects whether WebGL is supported.
     * @private
     * @return {boolean} `true` if WebGL is supported, `false` otherwise
     **/

    var isWebGLSupported = function () {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    };

    /**
     * Attaches an event handler function to an element.
     * @private
     * @param {HTMLElement} elt - The element
     * @param {string} evt - The event name
     * @param {function} f - The handler function
     * @return {void}
     **/

    var addEvent = function (elt, evt, f) {
        if (!!elt.addEventListener)
            elt.addEventListener(evt, f, false);
        else
            elt.attachEvent('on' + evt, f);
    };

    /**
     * Ensures that a number is in a given interval.
     * @private
     * @param {number} x - The number to check
     * @param {number} min - First endpoint
     * @param {number} max - Second endpoint
     * @return {number} The checked number
     **/

    var stayBetween = function (x, min, max) {
        return Math.max(min, Math.min(max, x));
    };

    /**
     * Calculates the distance between two points (square of the distance is enough).
     * @private
     * @param {number} x1 - First point horizontal coordinate
     * @param {number} y1 - First point vertical coordinate
     * @param {number} x2 - Second point horizontal coordinate
     * @param {number} y2 - Second point vertical coordinate
     * @return {number} Square of the wanted distance
     **/

    var dist = function (x1, y1, x2, y2) {
        var x = x2 - x1;
        var y = y2 - y1;
        return x * x + y * y;
    };

    /**
     * Returns the measure of an angle (between 0 and 2π).
     * @private
     * @param {number} angle - The angle to reduce
     * @param {boolean} [is_2pi_allowed=false] - Can the measure be equal to 2π?
     * @return {number} The wanted measure
     **/

    var getAngleMeasure = function (angle, is_2pi_allowed) {
        is_2pi_allowed = (is_2pi_allowed !== undefined) ? !!is_2pi_allowed : false;
        return (is_2pi_allowed && angle == 2 * Math.PI) ? 2 * Math.PI : angle - Math.floor(angle / (2.0 * Math.PI)) * 2.0 * Math.PI;
    };

    var getCartesian = function (radius, lat, long) {
        var x = radius * Math.cos(lat) * Math.sin(long);
        var y = radius * Math.sin(lat);
        var z = radius * Math.cos(lat) * Math.cos(long);
        return new THREE.Vector3(x, y, z);
    };

    /**
     * Starts to load the panorama.
     * @public
     * @return {void}
     **/

    this.load = function () {
        container.innerHTML = '';

        // Loading HTML: HTMLElement
        if (!!loading_html && loading_html.nodeType === 1)
            container.appendChild(loading_html);

        // Loading HTML: string
        else if (!!loading_html && typeof loading_html == 'string')
            container.innerHTML = loading_html;

        // Loading image
        else if (!!loading_img) {
            var loading = document.createElement('img');
            loading.setAttribute('src', loading_img);
            loading.setAttribute('alt', loading_msg);
            container.appendChild(loading);
        }

        // Loading text
        else
            container.textContent = loading_msg;

        // Adds a new container
        root = document.createElement('div');
        root.style.width = '100%';
        root.style.height = '100%';
        root.style.position = 'relative';
        root.style.overflow = 'hidden';

        // Is canvas supported?
        if (!isCanvasSupported()) {
            container.textContent = 'Canvas is not supported, update your browser!';
            return;
        }

        // Is Three.js loaded?
        if (window.THREE === undefined) {
            console.log('PhotoSphereViewer: Three.js is not loaded.');
            return;
        }

        // Current viewer size
        viewer_size = {
            width: 0,
            height: 0,
            ratio: 0
        };

        createSetting();
    };

    /**
     * Creates the 3D scene.
     * @private
     * @return {void}
     **/

    var createSetting = function () {
        // New size?
        if (new_viewer_size.width !== undefined)
            container.style.width = new_viewer_size.width.css;

        if (new_viewer_size.height !== undefined)
            container.style.height = new_viewer_size.height.css;

        fitToContainer();

        // The chosen renderer depends on whether WebGL is supported or not
        renderer = (isWebGLSupported()) ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize(viewer_size.width, viewer_size.height);

        for (var i = 0; i <= 1; i++) {
            scene[i] = new THREE.Scene();
            camera[i] = new THREE.PerspectiveCamera(PSV_FOV_MAX, viewer_size.ratio, 1, 3000);
            camera[i].position.set(0, 0, 0);
            scene[i].add(camera[i]);
        }

        actualIndex = 0;
        loadObjects();

        var startAnimation = args.startAnimation;
        if (startAnimation === undefined) {
            startAnimation = false;
        }
        moveTo(0, getInitial(), 0);
        loadCube(startAnimation);


        // Canvas container
        canvas_container = document.createElement('div');
        canvas_container.style.position = 'absolute';
        canvas_container.style.zIndex = 0;
        root.appendChild(canvas_container);

        // Navigation bar?
        if (display_navbar) {
            navbar.setStyle(navbar_style);
            navbar.create();
            root.appendChild(navbar.getBar());
        }

        // Adding events
        addEvent(window, 'resize', fitToContainer);

        if (user_interactions_allowed) {
            addEvent(canvas_container, 'mousedown', onMouseDown);
            addEvent(document, 'mousemove', onMouseMove);
            addEvent(canvas_container, 'mousemove', showNavbar);
            addEvent(document, 'mouseup', onMouseUp);

            addEvent(canvas_container, 'touchstart', onTouchStart);
            addEvent(document, 'touchend', onMouseUp);
            addEvent(document, 'touchmove', onTouchMove);

            addEvent(canvas_container, 'mousewheel', onMouseWheel);
            addEvent(canvas_container, 'DOMMouseScroll', onMouseWheel);
        }

        addEvent(document, 'fullscreenchange', fullscreenToggled);
        addEvent(document, 'mozfullscreenchange', fullscreenToggled);
        addEvent(document, 'webkitfullscreenchange', fullscreenToggled);
        addEvent(document, 'MSFullscreenChange', fullscreenToggled);

        sphoords.addListener(onDeviceOrientation);

        // First render
        container.innerHTML = '';
        container.appendChild(root);

        var canvas = renderer.domElement;
        canvas.style.display = 'block';

        initFade();

        canvas_container.appendChild(canvas);
        render();

        // Zoom?
        if (zoom_lvl > 0)
            zoom(zoom_lvl);

        // Animation?
        anim();
    };

    var inOutAnimationSteps = 20;
    var inOutYPosition = -900;

    var getInitial = function() {
        var initial = 0;
        if (data.initialView.long !== undefined) { //todo: add lat
            initial = math.eval(data.initialView.long);
        }
        return initial;
    };

    var inOutAnimation = function (out) {
        inOutAnimationHelper(inOutAnimationSteps, getInitial(), out);
    };

    var inOutAnimationHelper = function (step, initial, out) {
        var multiplicator = step/inOutAnimationSteps;
        if(out) {
            multiplicator = (inOutAnimationSteps-step)/inOutAnimationSteps;
        }
        var newYPostition = multiplicator * inOutYPosition;
        var newLat = -multiplicator * (Math.PI - 0.1);

        cube[0].position.set(0, newYPostition, 0);
        moveTo(0, initial, newLat);
        step--;
        if (step >= 0) {
            setTimeout(inOutAnimationHelper, PSV_ANIM_TIMEOUT, step, initial, out);
        }
        render();
    };

    var loadCube = function (startAnimation) {
        var cube = createCube(data.id, data.images.cubemaps.r2048.path, startAnimation);
        scene[actualIndex].add(cube);
    };

    var createCube = function (id, image, startAnimation) {
        var directions = ["nx", "px", "py", "ny", "pz", "nz"];
        var materials = [];
        var count = directions.length;
        for (var direction in directions) {
            var texture = THREE.ImageUtils.loadTexture(image + '/' + directions[direction] + '/0.0.jpg', {}, function () {
                count--;
                if (count === 0) {

                    /**
                     * Indicates that the loading is finished: the first image is rendered
                     * @callback PhotoSphereViewer~onReady
                     **/

                    triggerAction('ready');

                    if (startAnimation) {
                        inOutAnimation(false);
                    }

                    render();
                }
            });
            materials.push(new THREE.MeshBasicMaterial({map: texture, overdraw: true}));
        }
        var geometry = new THREE.BoxGeometry(2000, 2000, 2000);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.scale.x = -1;
        mesh.position.set(0, 0, 0);
        mesh.userData.belongsTo = id;
        mesh.userData.type = "cube";
        mesh.userData.id = id;
        mesh.name = "Cube " + id;
        cube[actualIndex] = mesh;
        return mesh;
    };

    var createArrows = function (id, arrows) {
        var arrows_array = [];
        for (var key in arrows) {
            var arrow = arrows[key];
            arrows_array.push(createArrow(id, key, arrow))
        }
        return arrows_array;
    };

    var createArrow = function (id, name, arrow) {

        var size = 30;
        if (arrow.size !== undefined)
            size = math.eval(arrow.size);
        var arrow_texture = '/images/objects/arrow.png';
        if (arrow.texture !== undefined)
            texture = arrow.texture;
        var radius = 90;
        if (arrow.radius !== undefined)
            radius = math.eval(arrow.radius);
        var lat = -Math.PI / 8;
        if (arrow.lat !== undefined)
            lat = math.eval(arrow.lat);
        var long = math.eval(arrow.long);
        var rotationX = Math.PI / 2;
        if (arrow.rotationX !== undefined)
            rotationX = rotationX - math.eval(arrow.rotationX);
        var rotationY = 0;
        if (arrow.rotationY !== undefined)
            rotationY = -math.eval(arrow.rotationY);
        var rotationZ = -long;
        if (arrow.rotationZ !== undefined)
            rotationZ = -rotationZ - math.eval(arrow.rotationZ);

        var planeGeometry = new THREE.PlaneGeometry(size, size);
        var planeTexture = THREE.ImageUtils.loadTexture(arrow_texture);
        var planeMaterial = new THREE.MeshBasicMaterial({
            map: planeTexture,
            side: THREE.DoubleSide,
            transparent: true
        });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        var vector = getCartesian(radius, lat, long);
        plane.position.add(vector);
        plane.rotation.x = rotationX;
        plane.rotation.y = rotationY;
        plane.rotation.z = rotationZ;
        plane.userData.clickaction = {
            type: "change_sphere",
            data: {
                this_sphere: id,
                this_arrow: name,
                this_long: long,
                this_lat: lat,
                next_sphere: arrow.next_sphere,
                next_camera_lat: arrow.next_camera_lat,
                next_camera_long: arrow.next_camera_long
            }
        };
        plane.userData.belongsTo = id;
        plane.userData.id = name;
        plane.userData.type = "arrow";
        plane.name = "Arrow " + name;

        return plane;

    };

    var loadNewSphere = function (clickData) {
        $.getJSON("/json/spheres/sphere_" + clickData.next_sphere + ".json", function (newData) {
            actualIndex = 1 - actualIndex;
            data = newData;
            clickable_objects = [];
            loadCube(false);
            var url = location.pathname;
            var expectedUrl = "/sphere/" + data.id;
            if (url !== expectedUrl) {
                history.pushState({}, "Sphere", "/sphere/" + data.id);
            }

            deleteObjects(false);

            var newLOng = long[actualIndex];
            if (clickData.next_camera_long !== undefined) {
                newLong = math.eval(clickData.next_camera_long);
            }
            if (data.arrows !== undefined) {
                for (var key in data.arrows) {
                    var arrow = data.arrows[key];
                    if (arrow.next_sphere == clickData.this_sphere) {
                        newLong = (math.eval(arrow.long) + Math.PI) % (2 * Math.PI);
                        break;
                    }
                }
            }
            var newViewLong = newLong + (long[1 - actualIndex] - math.eval(clickData.this_long));
            var newViewLat = lat[actualIndex];
            if (clickData.next_camera_lat !== undefined) {
                newViewLat = math.eval(clickData.next_camera_lat);
            }
            moveTo(actualIndex, newViewLong, newViewLat);

            nextSphereAnimation(newLong, clickData.this_long);

            if (grid) {
                addGrid();
            }
        });
    };

    var loadObjects = function () {
        clickableObjects = [];
        var arrows = createArrows(data.id, data.arrows);
        for (var arrow_index in arrows) {
            scene[actualIndex].add(arrows[arrow_index]);
            clickableObjects.push(arrows[arrow_index])
        }
    };

    var deleteObjects = function (cube) {
        for (var i = 0; i < scene[1 - actualIndex].children.length;) {
            var object = scene[1 - actualIndex].children[i];
            var belongsTo = object.userData.belongsTo;
            if (belongsTo !== undefined && belongsTo !== null && belongsTo !== data.id && (cube || object.userData.type !== "cube")) {
                scene[1 - actualIndex].remove(object);
            } else {
                i++;
            }
        }
    };

    var nextSphereAnimationSteps = 20;

    var nextSphereAnimation = function (newLong, oldLong) {
        nextSphereAnimationHelper(0, newLong, oldLong);
    };

    var nextSphereAnimationHelper = function (step, newLong, oldLong) {
        step++;
        quadmaterial.uniforms.mixRatio.value = Math.abs((1 - actualIndex) - step / nextSphereAnimationSteps);

        var oldCubePosition = getCartesian(step * 30, 0, (oldLong + Math.PI) % (2 * Math.PI));
        var newCubePosition = getCartesian(nextSphereAnimationSteps * 30 - step * 30, 0, newLong);
        cube[1 - actualIndex].position.set(oldCubePosition.x, oldCubePosition.y, oldCubePosition.z);
        cube[actualIndex].position.set(newCubePosition.x, newCubePosition.y, newCubePosition.z);
        if (step !== nextSphereAnimationSteps) {
            setTimeout(nextSphereAnimationHelper, PSV_ANIM_TIMEOUT, step, newLong, oldLong);
        } else {
            loadObjects();
            deleteObjects(true);
        }
        render();
    };

    this.showGrid = function (bool) {
        if (bool && !grid) {
            grid = true;
            addGrid(0);
            addGrid(1);
        } else if (!bool && grid) {
            grid = false;
            removeGrid(0);
            removeGrid(1);
        }
        render();
    };

    var addGrid = function (index) {
        var parts = 36; //Should be divisible by 4
        var labelrate = 3; //Show label every "labelrate" line (Should be a divisor of parts)
        var distance = 1000;

        var step = 2 * Math.PI * 1 / parts;
        var dashed;
        var point1, point2;
        var degreej, degreei;
        var j, i;
        var grid = new THREE.Object3D();
        var label = new THREE.Object3D();
        var text;

        //latitude marker
        for (j = 0; j < parts / 4; j++) {
            degreej = j * step;
            dashed = true;
            if (j % labelrate === 0) {
                dashed = false;
                text = Math.ceil((degreej / (Math.PI / 2)) * 90) + '/90*π/2';
                label.add(createGridLabel(text, distance - 10, degreej, 0, "#FF0000", false));
                label.add(createGridLabel(text, distance - 10, degreej, Math.PI, "#FF0000", false));
                if (j !== 0) {
                    label.add(createGridLabel('-' + text, distance - 10, -degreej, 0, "#FF0000", false));
                    label.add(createGridLabel('-' + text, distance - 10, -degreej, Math.PI, "#FF0000", false));
                }
            }
            for (i = 0; i < parts; i++) {//for (i = 0; i < 2 * Math.PI-offset; i += step) {
                degreei = i * step;
                point1 = getCartesian(distance, degreej, degreei);
                point2 = getCartesian(distance, degreej, degreei + step);
                grid.add(buildGridLine(point1, point2, 0xFF0000, dashed));
                if (j !== 0) {
                    point1 = getCartesian(distance, -degreej, degreei);
                    point2 = getCartesian(distance, -degreej, degreei + step);
                    grid.add(buildGridLine(point1, point2, 0xFF0000, dashed));
                }
            }
        }

        //longitude marker
        for (j = 0; j < parts; j++) {
            degreej = j * step;
            dashed = true;
            if (j % labelrate === 0) {
                dashed = false;
                text = Math.ceil((degreej / (2 * Math.PI)) * 360) + '/360*2π';
                label.add(createGridLabel(text, distance - 10, -labelrate * step / 2, degreej, "#00FF00", false));
            }
            for (i = 1; i < parts / 4; i++) {//for (i = step; i < Math.PI/2-offset; i += step) {
                degreei = i * step;
                point1 = getCartesian(distance, degreei, degreej);
                point2 = getCartesian(distance, degreei - step, degreej);
                grid.add(buildGridLine(point1, point2, 0x00FF00, dashed));
                point1 = getCartesian(distance, -degreei, degreej);
                point2 = getCartesian(distance, -degreei + step, degreej);
                grid.add(buildGridLine(point1, point2, 0x00FF00, dashed));
            }
        }

        grid.userData.type = "grid";
        label.userData.type = "grid";

        scene[index].add(grid);
        scene[index].add(label);

        addIdLabel(index);

    };

    var createGridLabel = function (text, radius, lat, long, color, isID) {
        var canvas1 = document.createElement('canvas');
        var context1 = canvas1.getContext('2d');
        var width = 270;
        if (isID) {
            width = 500;
        }
        var height = 90;
        canvas1.width = width;
        canvas1.height = height;
        context1.font = "50px Arial";
        context1.fillStyle = color;
        context1.fillText(text, 0, height);

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas1);
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
        material1.transparent = true;

        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas1.width, canvas1.height),
            material1
        );
        mesh1.position.add(getCartesian(radius, lat, long));
        mesh1.rotation.y = Math.PI + long;
        if (isID) {
            mesh1.userData.belongsTo = text;
            mesh1.rotation.x = -lat;
        }
        if (long === 0) {
            mesh1.rotation.x = -lat;
        }
        if (long === Math.PI) {
            mesh1.rotation.x = lat;
        }
        mesh1.userData.type = "grid";
        return mesh1;
    };

    var buildGridLine = function (src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(),
            mat;

        if (dashed) {
            mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 10, gapSize: 10});
        } else {
            mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var line = new THREE.Line(geom, mat, THREE.LinePieces);
        line.userData.type = "grid";

        return line;

    };

    var addIdLabel = function (index) {
        var idLabel0 = createGridLabel(data.id, 1000 - 100, -Math.PI / 2, 0, "#000000", true);
        var idLabel1 = createGridLabel(data.id, 1000 - 100, Math.PI / 2, 0, "#000000", true);

        scene[index].add(idLabel0);
        scene[index].add(idLabel1);
    };

    var removeGrid = function (index) {
        for (var i = 0; i < scene[index].children.length;) {
            var object = scene[index].children[i];
            var type = object.userData.type;
            if (type !== undefined && type !== null && type === "grid") {
                scene[index].remove(object);
            } else {
                i++;
            }
        }
    };


    /**
     * Renders an image.
     * @private
     * @return {void}
     **/

    var render = function () {
        var point0 = getCartesian(1, lat[0], long[0]);
        var point1 = getCartesian(1, lat[1], long[1]);

        camera[0].lookAt(point0);
        camera[1].lookAt(point1);

        // Stereo? TODO: 2 scene support
        if (stereo_effect !== null)
            stereo_effect.render(scene, camera);

        else {
            renderer.render(scene[0], camera[0], rtTexture0);
            renderer.render(scene[1], camera[1], rtTexture1);
            renderer.render(quadscene, fadeCamera, null, true);
        }
        //renderer.render(scene, camera);
    };

    var initFade = function () {
        // rendertargets
        rtTexture0 = new THREE.WebGLRenderTarget(viewer_size.width, viewer_size.height, { // CHANGED
            minFilter: THREE.LinearMipMapLinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat
        });
        rtTexture0.wrapS = rtTexture0.wrapT = THREE.RepeatWrapping;
        rtTexture0.repeat.set(1, -1);

        rtTexture1 = rtTexture0.clone();

        // Main screen
        fadeCamera = new THREE.OrthographicCamera(viewer_size.width / -2, viewer_size.width / 2, viewer_size.height / 2, viewer_size.height / -2, -10000, 10000);
        fadeCamera.position.z = 1000;
        fadeCamera.scale.y = -1;
        var quadgeometry = new THREE.PlaneGeometry(viewer_size.width, viewer_size.height);
        quadmaterial = new THREE.ShaderMaterial({
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

        quadmaterial.uniforms.mixRatio.value = 0;

        var quad = new THREE.Mesh(quadgeometry, quadmaterial);

        quadscene = new THREE.Scene();
        quadscene.add(quad);
        quadscene.add(fadeCamera);
    };

    /**
     * Starts the stereo effect.
     * @private
     * @return {void}
     **/

    var startStereo = function () {
        stereo_effect = new THREE.StereoEffect(renderer);
        stereo_effect.eyeSeparation = 5;
        stereo_effect.setSize(viewer_size.width, viewer_size.height);

        startDeviceOrientation();
        enableFullscreen();
        navbar.mustBeHidden();
        render();

        /**
         * Indicates that the stereo effect has been toggled.
         * @callback PhotoSphereViewer~onStereoEffectToggled
         * @param {boolean} enabled - `true` if stereo effect is enabled, `false` otherwise
         **/

        triggerAction('stereo-effect', true);
    };

    /**
     * Stops the stereo effect.
     * @private
     * @return {void}
     **/

    var stopStereo = function () {
        stereo_effect = null;
        renderer.setSize(viewer_size.width, viewer_size.height);

        navbar.mustBeHidden(false);
        render();

        triggerAction('stereo-effect', false);
    };

    /**
     * Toggles the stereo effect (virtual reality).
     * @public
     * @return {void}
     **/

    this.toggleStereo = function () {
        if (stereo_effect !== null)
            stopStereo();

        else
            startStereo();
    };

    /**
     * Automatically animates the panorama.
     * @private
     * @return {void}
     **/

    var anim = function () {
        if (anim_delay !== false)
            anim_timeout = setTimeout(startAutorotate, anim_delay);
    };

    /**
     * Automatically rotates the panorama.
     * @private
     * @return {void}
     **/

    var autorotate = function () {
        lat[0] -= (lat[0] - anim_lat_target) * anim_lat_offset;
        lat[1] -= (lat[1] - anim_lat_target) * anim_lat_offset;

        long[0] += anim_long_offset;
        long[1] += anim_long_offset;

        var again = true;

        if (!whole_circle) {
            long[0] = stayBetween(long[0], PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
            long[1] = stayBetween(long[1], PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);

            if (long[0] == PSV_MIN_LONGITUDE || long[0] == PSV_MAX_LONGITUDE) {
                // Must we reverse the animation or simply stop it?
                if (reverse_anim)
                    anim_long_offset *= -1;

                else {
                    //TODO: Animation for both cameras
                    stopAutorotate();
                    again = false;
                }
            }

            if (long[1] == PSV_MIN_LONGITUDE || long[1] == PSV_MAX_LONGITUDE) {
                // Must we reverse the animation or simply stop it?
                if (reverse_anim)
                    anim_long_offset *= -1;

                else {
                    stopAutorotate();
                    again = false;
                }
            }
        }

        long[0] = getAngleMeasure(long[0], true);
        long[1] = getAngleMeasure(long[1], true);

        render();

        if (again)
            autorotate_timeout = setTimeout(autorotate, PSV_ANIM_TIMEOUT);
    };

    /**
     * Starts the autorotate animation.
     * @private
     * @return {void}
     **/

    var startAutorotate = function () {
        autorotate();

        /**
         * Indicates that the autorotate animation state has changed.
         * @callback PhotoSphereViewer~onAutorotateChanged
         * @param {boolean} enabled - `true` if animation is enabled, `false` otherwise
         **/

        triggerAction('autorotate', true);
    };

    /**
     * Stops the autorotate animation.
     * @private
     * @return {void}
     **/

    var stopAutorotate = function () {
        clearTimeout(anim_timeout);
        anim_timeout = null;

        clearTimeout(autorotate_timeout);
        autorotate_timeout = null;

        triggerAction('autorotate', false);
    };

    /**
     * Launches/stops the autorotate animation.
     * @public
     * @return {void}
     **/

    this.toggleAutorotate = function () {
        clearTimeout(anim_timeout);

        if (!!autorotate_timeout)
            stopAutorotate();

        else
            startAutorotate();
    };

    /**
     * Resizes the canvas to make it fit the container.
     * @private
     * @return {void}
     **/

    var fitToContainer = function () {
        if (container.clientWidth != viewer_size.width || container.clientHeight != viewer_size.height) {
            resize({
                width: container.clientWidth,
                height: container.clientHeight
            });
        }
    };

    /**
     * Resizes the canvas to make it fit the container.
     * @public
     * @return {void}
     **/

    this.fitToContainer = function () {
        fitToContainer();
    };

    /**
     * Resizes the canvas.
     * @private
     * @param {object} size - New dimensions
     * @param {number} [size.width] - The new canvas width (default to previous width)
     * @param {number} [size.height] - The new canvas height (default to previous height)
     * @return {void}
     **/

    var resize = function (size) {
        viewer_size.width = (size.width !== undefined) ? parseInt(size.width) : viewer_size.width;
        viewer_size.height = (size.height !== undefined) ? parseInt(size.height) : viewer_size.height;
        viewer_size.ratio = viewer_size.width / viewer_size.height;

        if (!!camera[0]) {
            camera[0].aspect = viewer_size.ratio;
            camera[0].updateProjectionMatrix();
        }

        if (!!camera[1]) {
            camera[1].aspect = viewer_size.ratio;
            camera[1].updateProjectionMatrix();
        }

        if (!!renderer) {
            renderer.setSize(viewer_size.width, viewer_size.height);
            render();
        }

        if (!!stereo_effect) {
            stereo_effect.setSize(viewer_size.width, viewer_size.height);
            render();
        }
    };

    /**
     * Returns the current position in radians
     * @return {object} A longitude/latitude couple
     **/

    this.getPosition = function (index) {
        return {
            longitude: long[index],
            latitude: lat[index]
        };
    };

    /**
     * Returns the current position in degrees
     * @return {object} A longitude/latitude couple
     **/

    this.getPositionInDegrees = function (index) {
        return {
            longitude: long[index] * 180.0 / Math.PI,
            latitude: lat[index] * 180.0 / Math.PI
        };
    };

    /**
     * Moves to a specific position
     * @private
     * @param {number|string} longitude - The longitude of the targeted point
     * @param {number|string} latitude - The latitude of the targeted point
     * @return {void}
     **/

    var moveTo = function (index, longitude, latitude) {
        var long_tmp = parseAngle(longitude);

        if (!whole_circle)
            long_tmp = stayBetween(long_tmp, PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);

        var lat_tmp = parseAngle(latitude);

        if (lat_tmp > Math.PI)
            lat_tmp -= 2 * Math.PI;

        lat_tmp = stayBetween(lat_tmp, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);

        long[index] = long_tmp;
        lat[index] = lat_tmp;

        render();
    };

    /**
     * Moves to a specific position
     * @public
     * @param {number|string} longitude - The longitude of the targeted point
     * @param {number|string} latitude - The latitude of the targeted point
     * @return {void}
     **/

    this.moveTo = function (index, longitude, latitude) {
        moveTo(index, longitude, latitude);
    };

    /**
     * The user wants to move.
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onMouseDown = function (evt) {

        mouse.x = ( evt.clientX / viewer_size.width ) * 2 - 1;
        mouse.y = -( evt.clientY / viewer_size.height ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera[actualIndex]);
        var intersects = raycaster.intersectObjects(clickableObjects);
        if (intersects.length > 0) {
            clickedObjects[0] = intersects[0].object;
            intersects[0].object.material.color.setHex(0x999999);
            render();
        }


        startMove(parseInt(evt.clientX), parseInt(evt.clientY));
    };

    /**
     * The user wants to move or to zoom (mobile version).
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onTouchStart = function (evt) {
        // Move
        if (evt.touches.length == 1) {
            var touch = evt.touches[0];
            if (touch.target.parentNode == canvas_container)
                startMove(parseInt(touch.clientX), parseInt(touch.clientY));
        }

        // Zoom
        else if (evt.touches.length == 2) {
            onMouseUp();

            if (evt.touches[0].target.parentNode == canvas_container && evt.touches[1].target.parentNode == canvas_container)
                startTouchZoom(dist(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY));
        }

        // Show navigation bar if hidden
        showNavbar();
    };

    /**
     * Initializes the movement.
     * @private
     * @param {integer} x - Horizontal coordinate
     * @param {integer} y - Vertical coordinate
     * @return {void}
     **/

    var startMove = function (x, y) {
        mouse_x = x;
        mouse_y = y;

        stopAutorotate();

        mousedown = true;
    };

    /**
     * Initializes the "pinch to zoom" action.
     * @private
     * @param {number} d - Square of the distance between the two fingers
     * @return {void}
     **/

    var startTouchZoom = function (d) {
        touchzoom_dist = d;

        touchzoom = true;
    };

    /**
     * The user wants to stop moving (or stop zooming with their finger).
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onMouseUp = function (evt) {
        mousedown = false;
        touchzoom = false;

        if (clickedObjects[0] !== undefined) {
            loadNewSphere(clickedObjects[0].userData.clickaction.data);
            clickedObjects[0] = undefined;
        }

    };

    /**
     * The user moves the image.
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onMouseMove = function (evt) {

        if (clickedObjects[0] !== undefined) {
            mouse.x = ( evt.clientX / viewer_size.width ) * 2 - 1;
            mouse.y = -( evt.clientY / viewer_size.height ) * 2 + 1;
            raycaster.setFromCamera(mouse, camera[actualIndex]);
            var intersects = raycaster.intersectObjects(clickedObjects);
            if (!intersects.length > 0) {
                clickedObjects[0].material.color.setHex(0xffffff);
                clickedObjects[0] = undefined;
            }
        }

        evt.preventDefault();
        move(parseInt(evt.clientX), parseInt(evt.clientY));
    };

    /**
     * The user moves the image (mobile version).
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onTouchMove = function (evt) {
        // Move
        if (evt.touches.length == 1 && mousedown) {
            var touch = evt.touches[0];
            if (touch.target.parentNode == canvas_container) {
                evt.preventDefault();
                move(parseInt(touch.clientX), parseInt(touch.clientY));
            }
        }

        // Zoom
        else if (evt.touches.length == 2) {
            if (evt.touches[0].target.parentNode == canvas_container && evt.touches[1].target.parentNode == canvas_container && touchzoom) {
                evt.preventDefault();

                // Calculate the new level of zoom
                var d = dist(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
                var diff = d - touchzoom_dist;

                if (diff != 0) {
                    var direction = diff / Math.abs(diff);
                    zoom(zoom_lvl + direction);

                    touchzoom_dist = d;
                }
            }
        }
    };

    /**
     * Movement.
     * @private
     * @param {integer} x - Horizontal coordinate
     * @param {integer} y - Vertical coordinate
     * @return {void}
     **/

    var move = function (x, y) {
        if (mousedown) {
            long[0] += (x - mouse_x) * PSV_LONG_OFFSET;
            long[1] += (x - mouse_x) * PSV_LONG_OFFSET;

            if (!whole_circle) {
                long[0] = stayBetween(long[0], PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
                long[1] = stayBetween(long[1], PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
            }

            long[0] = getAngleMeasure(long[0], true);
            long[1] = getAngleMeasure(long[1], true);

            lat[0] += (y - mouse_y) * PSV_LAT_OFFSET;
            lat[1] += (y - mouse_y) * PSV_LAT_OFFSET;
            lat[0] = stayBetween(lat[0], PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);
            lat[1] = stayBetween(lat[1], PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);

            mouse_x = x;
            mouse_y = y;
            render();
        }
    };

    /**
     * Starts following the device orientation.
     * @private
     * @return {void}
     **/

    var startDeviceOrientation = function () {
        sphoords.start();
        stopAutorotate();

        /**
         * Indicates that we starts/stops following the device orientation.
         * @callback PhotoSphereViewer~onDeviceOrientationStateChanged
         * @param {boolean} state - `true` if device orientation is followed, `false` otherwise
         **/

        triggerAction('device-orientation', true);
    };

    /**
     * Stops following the device orientation.
     * @private
     * @return {void}
     **/

    var stopDeviceOrientation = function () {
        sphoords.stop();

        triggerAction('device-orientation', false);
    };

    /**
     * Starts/stops following the device orientation.
     * @public
     * @return {void}
     **/

    this.toggleDeviceOrientation = function () {
        if (sphoords.isEventAttached())
            stopDeviceOrientation();

        else
            startDeviceOrientation();
    };

    /**
     * The user moved their device.
     * @private
     * @param {object} coords - The spherical coordinates to look at
     * @param {number} coords.longitude - The longitude
     * @param {number} coords.latitude - The latitude
     * @return {void}
     **/

    var onDeviceOrientation = function (coords) {
        long[0] = stayBetween(coords.longitude, PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
        long[1] = stayBetween(coords.longitude, PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
        lat[0] = stayBetween(coords.latitude, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);
        lat[1] = stayBetween(coords.latitude, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);

        render();
    };

    /**
     * The user wants to zoom.
     * @private
     * @param {Event} evt - The event
     * @return {void}
     **/

    var onMouseWheel = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var delta = (evt.detail) ? -evt.detail : evt.wheelDelta;

        if (delta != 0) {
            var direction = parseInt(delta / Math.abs(delta));
            zoom(zoom_lvl + direction);
        }
    };

    /**
     * Sets the new zoom level.
     * @private
     * @param {integer} level - New zoom level
     * @return {void}
     **/

    var zoom = function (level) {
        zoom_lvl = stayBetween(parseInt(Math.round(level)), 0, 100);

        camera[0].fov = PSV_FOV_MAX + (zoom_lvl / 100) * (PSV_FOV_MIN - PSV_FOV_MAX);
        camera[0].updateProjectionMatrix();
        camera[1].fov = PSV_FOV_MAX + (zoom_lvl / 100) * (PSV_FOV_MIN - PSV_FOV_MAX);
        camera[1].updateProjectionMatrix();
        render();

        /**
         * Indicates that the zoom level has changed.
         * @callback PhotoSphereViewer~onZoomUpdated
         * @param {number} zoom_level - The new zoom level
         **/

        triggerAction('zoom-updated', zoom_lvl);
    };

    /**
     * Sets the new zoom level.
     * @public
     * @param {integer} level - New zoom level
     * @return {void}
     **/

    this.zoom = function (level) {
        zoom(level);
    };

    /**
     * Zoom in.
     * @public
     * @return {void}
     **/

    this.zoomIn = function () {
        if (zoom_lvl < 100)
            zoom(zoom_lvl + 1);
    };

    /**
     * Zoom out.
     * @public
     * @return {void}
     **/

    this.zoomOut = function () {
        if (zoom_lvl > 0)
            zoom(zoom_lvl - 1);
    };

    /**
     * Detects whether fullscreen is enabled or not.
     * @private
     * @return {boolean} `true` if fullscreen is enabled, `false` otherwise
     **/

    var isFullscreenEnabled = function () {
        return (!!document.fullscreenElement || !!document.mozFullScreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement);
    };

    /**
     * Fullscreen state has changed.
     * @private
     * @return {void}
     **/

    var fullscreenToggled = function () {
        // Fix the (weird and ugly) Chrome and IE behaviors
        if (!!document.webkitFullscreenElement || !!document.msFullscreenElement) {
            real_viewer_size.width = container.style.width;
            real_viewer_size.height = container.style.height;

            container.style.width = '100%';
            container.style.height = '100%';
            fitToContainer();
        }

        else if (!!container.webkitRequestFullscreen || !!container.msRequestFullscreen) {
            container.style.width = real_viewer_size.width;
            container.style.height = real_viewer_size.height;
            fitToContainer();
        }

        /**
         * Indicates that the fullscreen mode has been toggled.
         * @callback PhotoSphereViewer~onFullscreenToggled
         * @param {boolean} enabled - `true` if fullscreen is enabled, `false` otherwise
         **/

        triggerAction('fullscreen-mode', isFullscreenEnabled());
    };

    /**
     * Enables fullscreen.
     * @private
     * @return {void}
     **/

    var enableFullscreen = function () {
        if (!!container.requestFullscreen)
            container.requestFullscreen();

        else if (!!container.mozRequestFullScreen)
            container.mozRequestFullScreen();

        else if (!!container.webkitRequestFullscreen)
            container.webkitRequestFullscreen();

        else if (!!container.msRequestFullscreen)
            container.msRequestFullscreen();
    };

    /**
     * Disables fullscreen.
     * @private
     * @return {void}
     **/

    var disableFullscreen = function () {
        if (!!document.exitFullscreen)
            document.exitFullscreen();

        else if (!!document.mozCancelFullScreen)
            document.mozCancelFullScreen();

        else if (!!document.webkitExitFullscreen)
            document.webkitExitFullscreen();

        else if (!!document.msExitFullscreen)
            document.msExitFullscreen();
    };

    /**
     * Enables/disables fullscreen.
     * @public
     * @return {void}
     **/

    this.toggleFullscreen = function () {
        // Switches to fullscreen mode
        if (!isFullscreenEnabled())
            enableFullscreen();

        // Switches to windowed mode
        else
            disableFullscreen();
    };

    /**
     * Shows the navigation bar.
     * @private
     * @return {void}
     **/

    var showNavbar = function () {
        if (display_navbar)
            navbar.show();
    };

    /**
     * Parses an animation speed.
     * @private
     * @param {string} speed - The speed, in radians/degrees/revolutions per second/minute
     * @return {number} The speed in radians
     **/

    var parseAnimationSpeed = function (speed) {
        speed = speed.toString().trim();

        // Speed extraction
        var speed_value = parseFloat(speed.replace(/^(-?[0-9]+(?:\.[0-9]*)?).*$/, '$1'));
        var speed_unit = speed.replace(/^-?[0-9]+(?:\.[0-9]*)?(.*)$/, '$1').trim();

        // "per minute" -> "per second"
        if (speed_unit.match(/(pm|per minute)$/))
            speed_value /= 60;

        var rad_per_second = 0;

        // Which unit?
        switch (speed_unit) {
            // Revolutions per minute / second
            case 'rpm':
            case 'rev per minute':
            case 'revolutions per minute':
            case 'rps':
            case 'rev per second':
            case 'revolutions per second':
                // speed * 2pi
                rad_per_second = speed_value * 2 * Math.PI;
                break;

            // Degrees per minute / second
            case 'dpm':
            case 'deg per minute':
            case 'degrees per minute':
            case 'dps':
            case 'deg per second':
            case 'degrees per second':
                // Degrees to radians (rad = deg * pi / 180)
                rad_per_second = speed_value * Math.PI / 180;
                break;

            // Radians per minute / second
            case 'rad per minute':
            case 'radians per minute':
            case 'rad per second':
            case 'radians per second':
                rad_per_second = speed_value;
                break;

            // Unknown unit
            default:
                m_anim = false;
        }

        // Longitude offset
        return rad_per_second * PSV_ANIM_TIMEOUT / 1000;
    };

    /**
     * Parses an angle given in radians or degrees.
     * @private
     * @param {number|string} angle - Angle in radians (number) or in degrees (string)
     * @return {number} The angle in radians
     **/

    var parseAngle = function (angle) {
        angle = angle.toString().trim();

        // Angle extraction
        var angle_value = parseFloat(angle.replace(/^(-?[0-9]+(?:\.[0-9]*)?).*$/, '$1'));
        var angle_unit = angle.replace(/^-?[0-9]+(?:\.[0-9]*)?(.*)$/, '$1').trim();

        // Degrees
        if (angle_unit == 'deg')
            angle_value *= Math.PI / 180;

        // Radians by default, we don't have anyting to do
        return getAngleMeasure(angle_value);
    };

    /**
     * Sets the viewer size.
     * @private
     * @param {object} size - An object containing the wanted width and height
     * @return {void}
     **/

    var setNewViewerSize = function (size) {
        // Checks all the values
        for (dim in size) {
            // Only width and height matter
            if (dim == 'width' || dim == 'height') {
                // Size extraction
                var size_str = size[dim].toString().trim();

                var size_value = parseFloat(size_str.replace(/^([0-9]+(?:\.[0-9]*)?).*$/, '$1'));
                var size_unit = size_str.replace(/^[0-9]+(?:\.[0-9]*)?(.*)$/, '$1').trim();

                // Only percentages and pixels are allowed
                if (size_unit != '%')
                    size_unit = 'px';

                // We're good
                new_viewer_size[dim] = {
                    css: size_value + size_unit,
                    unit: size_unit
                };
            }
        }
    };

    /**
     * Adds a function to execute when a given action occurs.
     * @public
     * @param {string} name - The action name
     * @param {function} f - The handler function
     * @return {void}
     **/

    this.addAction = function (name, f) {
        // New action?
        if (!(name in actions))
            actions[name] = [];

        actions[name].push(f);
    };

    /**
     * Triggers an action.
     * @private
     * @param {string} name - Action name
     * @param {*} arg - An argument to send to the handler functions
     * @return {void}
     **/

    var triggerAction = function (name, arg) {
        // Does the action have any function?
        if ((name in actions) && !!actions[name].length) {
            for (var i = 0, l = actions[name].length; i < l; ++i) {
                if (arg !== undefined)
                    actions[name][i](arg);

                else
                    actions[name][i]();
            }
        }
    };

    // Required parameters Todo: General checks
    if (args === undefined || args.data === undefined || args.data.images === undefined || args.data.images.cubemaps === undefined || args.container === undefined) {
        console.log('PhotoSphereViewer: no value given for data, data.image.cubemap or container');
        return;
    }

    var data = args.data;
    var grid = false;

    // Movement speed
    var PSV_LONG_OFFSET = (args.long_offset !== undefined) ? parseFloat(args.long_offset) : Math.PI / 360.0;
    var PSV_LAT_OFFSET = (args.lat_offset !== undefined) ? parseFloat(args.lat_offset) : Math.PI / 180.0;

    // Minimum and maximum fields of view in degrees
    var PSV_FOV_MIN = (args.min_fov !== undefined) ? stayBetween(parseFloat(args.min_fov), 1, 179) : 30;
    var PSV_FOV_MAX = (args.max_fov !== undefined) ? stayBetween(parseFloat(args.max_fov), 1, 179) : 90;

    // Minimum tilt up / down angles
    var PSV_TILT_UP_MAX = (args.tilt_up_max !== undefined) ? stayBetween(parseAngle(args.tilt_up_max), 0, Math.PI / 2.0) : Math.PI / 2.0;
    var PSV_TILT_DOWN_MAX = (args.tilt_down_max !== undefined) ? -stayBetween(parseAngle(args.tilt_down_max), 0, Math.PI / 2.0) : -Math.PI / 2.0;

    // Minimum and maximum visible longitudes
    var min_long = (args.min_longitude !== undefined) ? parseAngle(args.min_longitude) : 0;
    var max_long = (args.max_longitude !== undefined) ? parseAngle(args.max_longitude) : 0;

    var whole_circle = (min_long == max_long);

    if (whole_circle) {
        min_long = 0;
        max_long = 2 * Math.PI;
    }

    else if (max_long == 0)
        max_long = 2 * Math.PI;

    var PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE;
    if (min_long < max_long) {
        PSV_MIN_LONGITUDE = min_long;
        PSV_MAX_LONGITUDE = max_long;
    }

    else {
        PSV_MIN_LONGITUDE = max_long;
        PSV_MAX_LONGITUDE = min_long;
    }

    // Default position
    var lat = [];
    lat[0] = 0;
    lat[1] = 0;
    var long = [];
    long[0] = PSV_MIN_LONGITUDE;
    long[1] = PSV_MIN_LONGITUDE;

    if (args.default_position !== undefined) {
        if (args.default_position.lat !== undefined) {
            var lat_angle = parseAngle(args.default_position.lat);
            if (lat_angle > Math.PI)
                lat_angle -= 2 * Math.PI;

            lat[0] = stayBetween(lat_angle, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);
            lat[1] = stayBetween(lat_angle, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);
        }

        if (args.default_position.long !== undefined) {
            long[0] = stayBetween(parseAngle(args.default_position.long), PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
            long[1] = stayBetween(parseAngle(args.default_position.long), PSV_MIN_LONGITUDE, PSV_MAX_LONGITUDE);
        }
    }

    // Default zoom level
    var zoom_lvl = 0;

    if (args.zoom_level !== undefined)
        zoom_lvl = stayBetween(parseInt(Math.round(args.zoom_level)), 0, 100);

    // Animation constants
    var PSV_FRAMES_PER_SECOND = 60;
    var PSV_ANIM_TIMEOUT = 1000 / PSV_FRAMES_PER_SECOND;

    // Delay before the animation
    var anim_delay = 2000;

    if (args.time_anim !== undefined) {
        if (typeof args.time_anim == 'number' && args.time_anim >= 0)
            anim_delay = args.time_anim;

        else
            anim_delay = false;
    }

    // Horizontal animation speed
    var anim_long_offset = (args.anim_speed !== undefined) ? parseAnimationSpeed(args.anim_speed) : parseAnimationSpeed('2rpm');

    // Reverse the horizontal animation if autorotate reaches the min/max longitude
    var reverse_anim = true;

    if (args.reverse_anim !== undefined)
        reverse_anim = !!args.reverse_anim;

    // Vertical animation speed
    var anim_lat_offset = (args.vertical_anim_speed !== undefined) ? parseAnimationSpeed(args.vertical_anim_speed) : parseAnimationSpeed('2rpm');

    // Vertical animation target (default: equator)
    var anim_lat_target = 0;

    if (args.vertical_anim_target !== undefined) {
        var lat_target_angle = parseAngle(args.vertical_anim_target);
        if (lat_target_angle > Math.PI)
            lat_target_angle -= 2 * Math.PI;

        anim_lat_target = stayBetween(lat_target_angle, PSV_TILT_DOWN_MAX, PSV_TILT_UP_MAX);
    }

    // Navigation bar
    var navbar = new PSVNavBar(this);

    // Must we display the navigation bar?
    var display_navbar = (args.navbar !== undefined) ? !!args.navbar : false;

    // Style of the navigation bar
    var navbar_style = (args.navbar_style !== undefined) ? args.navbar_style : {};

    // Are user interactions allowed?
    var user_interactions_allowed = (args.allow_user_interactions !== undefined) ? !!args.allow_user_interactions : true;

    if (!user_interactions_allowed)
        display_navbar = false;

    // Container
    var container = args.container;

    // Size of the viewer
    var viewer_size, new_viewer_size = {}, real_viewer_size = {};
    if (args.size !== undefined)
        setNewViewerSize(args.size);

    // Some useful attributes
    var actualIndex = 0;
    var root, canvas_container;
    var renderer = null, stereo_effect = null;
    var camera = [];
    camera[0] = null;
    camera[1] = null;
    var scene = [];
    scene[0] = null;
    scene[1] = null;
    var mousedown = false, mouse_x = 0, mouse_y = 0;
    var touchzoom = false, touchzoom_dist = 0;
    var autorotate_timeout = null, anim_timeout = null;
    var cube = [];
    cube[0] = null;
    cube[1] = null;
    var fadeCamera = null;
    var quadscene, quadmaterial;
    var rtTexture0, rtTexture1;

    var raycaster;
    var mouse;

    //TODO: move
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    var clickableObjects = [];
    var clickedObjects = [];

    var sphoords = new Sphoords();

    var actions = {};

    // Loading message
    var loading_msg = (args.loading_msg !== undefined) ? args.loading_msg.toString() : 'Loading…';

    // Loading image
    var loading_img = (args.loading_img !== undefined) ? args.loading_img.toString() : null;

    // Loading HTML
    var loading_html = (args.loading_html !== undefined) ? args.loading_html : null;

    // Function to call once panorama is ready?
    if (args.onready !== undefined)
        this.addAction('ready', args.onready);

    // Go?
    var autoload = (args.autoload !== undefined) ? !!args.autoload : true;

    if (autoload)
        this.load();
};
