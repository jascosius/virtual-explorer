/**
 * Main class which sets global functions and configs
 */
(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    var explore = window.explore;
    var $ = window.$;

    if (explore.config === undefined) {
        explore.config = {};
    }
    var config = explore.config;

    //Sets existing resolutions
    config.resolutions = [
        {name: "menu.resolution.small", image: "/images/menu/res_small.png", preview: "64", cubemap: "512"},
        {name: "menu.resolution.middle", image: "/images/menu/res_middle.png", preview: "128", cubemap: "1024"},
        {name: "menu.resolution.large", image: "/images/menu/res_large.png", preview: "256", cubemap: "2048"}
    ];

    //Sets existing languages
    config.languages = [
        {lang: "de-DE", name: "menu.language", image: "/images/menu/lang_de.png"},
        {lang: "en-UK", name: "menu.language", image: "/images/menu/lang_en.png"}
    ];

    //Sets the map to load as default
    config.defaultMap = "44c2e9bdcaf4c29b";

    //Sets the default resolution and language (element in array above)
    config.res = 0;
    config.lang = 0;

    /**
     * Sets a cookie
     * @param {string} cname - name of the cookie
     * @param {string} cvalue - value of the cookie
     */
    var setCookie = function (cname, cvalue) {
        var exdays = 30;
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    /**
     * Gets the value of a cookie
     * @param {string} cname - name of the cookie
     * @returns {string} - value of the cookie
     */
    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };

    /**
     * Changes the resolution to the next resolution in the array above and reloads the page content
     */
    explore.changeResolution = function () {
        config.res = (config.res + 1) % config.resolutions.length;
        $('#menu_resolution_img').attr("src", config.resolutions[config.res].image);
        setCookie("res", config.res);
        explore.load(false);
    };

    /**
     * Changes the language to the next langugae in the array above and reloads the page content
     */
    explore.changeLanguage = function () {
        config.lang = (config.lang + 1) % config.languages.length;
        $('#menu_language_img').attr("src", config.languages[config.lang].image);
        $.i18n.init({lng: config.languages[config.lang].lang, resGetPath: '/locales/__lng__/__ns__.json'}, initLang);
        setCookie("lang", config.lang);
        explore.load(false);
    };

    //Sets the initial resolution and language if corresponding cookies exist
    var lang = getCookie("lang");
    if (lang !== "") {
        config.lang = lang;
    }
    var res = getCookie("res");
    if (res !== "") {
        config.res = res;
    }

    /**
     * Causes the Browser to toggle fullscreen
     */
    explore.toggleFullscreen = function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    };

    /**
     * Call after fullscreen toggled to update the icons
     */
    explore.fullscreenToggled = function () {
        if (!window.screenTop && !window.screenY) {
            $('#menu_fullscreen_img').attr("src", "/images/menu/exit_fullscreen.png").attr("title", $.i18n.t('menu.fullscreen.exit'));
        } else {
            $('#menu_fullscreen_img').attr("src", "/images/menu/enter_fullscreen.png").attr("title", $.i18n.t('menu.fullscreen.enter'));
        }
    };

    /**
     * Adds an event to an element
     * @param elt {object} - element
     * @param evt {string} - event
     * @param f {function} - function to call
     */
    explore.addEvent = function (elt, evt, f) {
        elt.addEventListener(evt, f, false);
    };

    /**
     * Removes an event from an element
     * @param elt {object} - element
     * @param evt {string} - event
     * @param f {function} - function to remove
     */
    explore.removeEvent = function (elt, evt, f) {
        elt.removeEventListener(evt, f);
    };

    //Add events (for different browser) to call 'fullscreenToggled' when fullscreen toggled
    explore.addEvent(window.document, 'fullscreenchange', explore.fullscreenToggled);
    explore.addEvent(window.document, 'mozfullscreenchange', explore.fullscreenToggled);
    explore.addEvent(window.document, 'webkitfullscreenchange', explore.fullscreenToggled);
    explore.addEvent(window.document, 'MSFullscreenChange', explore.fullscreenToggled);

    /**
     * Function gets called, when history state changes
     * Checks the history state and loads corresponding content
     * @param event
     */
    window.onpopstate = function (event) {
        if (event.state !== null) {
            if (event.state.type === 'map') {
                explore.loadMap(event.state.id);
            } else if (event.state.type === 'sphere') {
                explore.loadSphere(event.state.id, false);
            } else {
                explore.loadMap();
            }
        } else {
            explore.loadMap();
        }
    };

    /**
     * Removes the current sphere (html divs and javascript objects)
     */
    var removeSphere = function () {
        if (explore.sphere.sphere !== undefined && explore.sphere.sphere !== null) {
            explore.popup.showPopup();
            explore.sphere.sphere.removeEvents();
            explore.sphere.sphere = null;
            $('#sphere').remove();
        }
    };

    /**
     * Removes the current map (html divs and javascript objects)
     */
    var removeMap = function () {
        $('#map').remove();
        explore.map.map = null;
        $('#menu_map').css("display", "block");
    };


    /**
     * Loads a sphere
     * @param id {string} - ID of the sphere to load
     * @param startAnimation {bool} - animate the entrance into the sphere
     */
    explore.loadSphere = function (id, startAnimation) {
        explore.loadingData.id = id;
        explore.loadingData.type = "sphere";
        //Make sure no other sphere exists
        removeSphere();
        $('#explore').append($('<div/>', {
            id: 'sphere',
            class: 'fullsize invisible'
        }));
        //Set div visible when ready and remove map
        var onReady = function () {
            explore.stopLoading();
            $('#sphere').removeClass('invisible');
            removeMap();
        };
        //Make sure no popup is shown
        explore.popup.showPopup();
        //Update browser history
        history.pushState({type: 'sphere', id: id}, "Sphere", "/sphere/" + id);

        $.getJSON("/json/spheres/sphere_" + id + ".json", function (data) {
            explore.sphere.sphere = Object.create(explore.sphere.Sphere).init(data, onReady, startAnimation);
        });
    };

    /**
     * loads a map
     * @param id {string} - ID of the map to load
     * @param animation {bool} - animate the exit of the sphere (only if called from sphere)
     */
    explore.loadMap = function (id,animation) {
        //Make sure no other map is existing
        removeMap();

        //Select ID if no ID is set
        if (id == null) {
            if (explore.sphere.sphere == null) {
                id = config.defaultMap;
            } else {
                id = explore.sphere.sphere.getMap(0);
            }
        }
        explore.loadingData.id = id;
        explore.loadingData.type = "map";
        $('#menu_map').css("display", "none");
        $('#explore').append($('<div/>', {
            id: 'map',
            class: 'fullsize invisible'
        }));
        //Set div visible when ready and remove sphere
        var onReady = function () {
            explore.stopLoading();
            $('#map').removeClass('invisible');
            removeSphere();
        };

        //Initiate animation to exit sphere
        if(animation){
            var sphere = explore.sphere.sphere;
            sphere.getSubScene().deleteObjects(false);
            var openSphereAnimation = Object.create(explore.sphere.OpenSphereAnimation).init(sphere, sphere.getSubScene().getLat(), null, sphere.getSubScene().getLong(), sphere.getSubScene().getCube(), true, onReady);
            openSphereAnimation.animate();
        } else {
            onReady();
        }
        //Make sure no popup is shown
        explore.popup.showPopup();
        //Update browser history
        history.pushState({type: 'map', id: id}, "Map", "/map/" + id);

        $.getJSON("/json/maps/map_" + id + ".json", function (data) {
            $.getJSON("/json/maps/map_spheres_" + id + ".json", function (spheres) {
                explore.map.map = Object.create(explore.map.Map).init(data, spheres);
            });
        });
    };

    /**
     * Disables the map when sphere is not ready after map leave animation is over
     */
    explore.disableMap = function () {
        removeMap();
    };

    /**
     * Call if a process is started, which may take a while
     * Shows a loading message after a while
     * Call 'stopLoading' when process is finished
     */
    explore.startLoading = function () {
        explore.loading = true;
        var loading = function () {
            if (explore.loading === true) {
                $('#menu_loading').css("display", "block");
            }
        };
        setTimeout(loading, 2000);
    };
    /**
     * Removes loading animation
     */
    explore.stopLoading = function () {
        explore.loading = false;
        $('#menu_loading').css("display", "none");
    };

    /**
     * Initializes the language library
     */
    var initLang = function () {
        $('#menu_fullscreen_img').attr("title", $.i18n.t('menu.fullscreen.enter'));
        $('#menu_resolution_img').attr("title", $.i18n.t(config.resolutions[config.res].name));
        $('#menu_language_img').attr("title", $.i18n.t(config.languages[config.lang].name));
        $('#menu_map_img').attr("title", $.i18n.t('menu.map'));
    };

    /**
     * Reloads the current content if exist
     * Otherwise loads default map or content set by the link
     * @param addHistory {bool} - Set new history entry for this action
     */
    explore.load = function (addHistory) {
        explore.startLoading();
        if (explore.loadingData.type === "sphere") {
            if(addHistory) {
                history.pushState({
                    type: 'sphere',
                    id: explore.loadingData.id
                }, "Sphere", "/sphere/" + explore.loadingData.id);
            }
            explore.loadSphere(explore.loadingData.id, false);
        } else if (explore.loadingData.type === "map") {
            if(addHistory) {
                history.pushState({type: 'map', id: explore.loadingData.id}, "Map", "/map/" + explore.loadingData.id);
            }
            explore.loadMap(explore.loadingData.id);
        } else {
            explore.loadMap();
        }
    };

    /**
     * Called when DOM is ready
     * Initializes language and popup and loads content
     */
    $(function () {
        $.i18n.init({lng: config.languages[config.lang].lang, resGetPath: '/locales/__lng__/__ns__.json'}, initLang);
        $('#menu_resolution_img').attr("src", config.resolutions[config.res].image);
        $('#menu_language_img').attr("src", config.languages[config.lang].image);
        explore.popup = Object.create(explore.Popup).init();
        explore.load(true);
    });

}(window));