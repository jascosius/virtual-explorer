(function(window){
    "use strict";
    if(window.explore === undefined) {
        window.explore = {};
    }
    var explore = window.explore;
    var $ = window.$;
    
    if(explore.config === undefined) {
        explore.config = {};
    }
    var config = explore.config;

    config.resolutions = [
        {name: "menu.resolution.small", image: "images/menu/res_small.png", preview: "64", cubemap: "512"},
        {name: "menu.resolution.middle", image: "images/menu/res_middle.png", preview: "128", cubemap: "1024"},
        {name: "menu.resolution.large", image: "images/menu/res_large.png", preview: "256", cubemap: "2048"}
    ];

    config.languages = [
        {lang: "de-DE", name: "menu.language", image: "images/menu/lang_de.png"},
        {lang: "en-UK", name: "menu.language", image: "images/menu/lang_en.png"}
    ];

    var setCookie = function(cname, cvalue) {
        var exdays = 30;
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    };

    explore.changeResolution = function () {
        config.res = (config.res + 1) % config.resolutions.length;
        $('#menu_resolution_img').attr("src",config.resolutions[config.res].image);
        setCookie("res",config.res);
    };

    explore.changeLanguage = function () {
        config.lang = (config.lang + 1) % config.languages.length;
        $('#menu_language_img').attr("src",config.languages[config.lang].image);
        $.i18n.init({lng: config.languages[config.lang].lang, resGetPath: '/locales/__lng__/__ns__.json'},initLang);
        setCookie("lang",config.lang);
    };

    config.lang = 0;
    config.res = 0;

    var lang = getCookie("lang");
    if(lang !== "") {
        config.lang = lang;
    }
    var res = getCookie("res");
    if(res !== "") {
        config.res = res;
    }

    /**
     * Causes the Browser to toogle fullscreen
     */
    explore.toggleFullscreen = function() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            $('#menu_fullscreen_img').attr("src","images/menu/leave_fullscreen.png").attr("title",$.i18n.t('menu.fullscreen.leave'));
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            $('#menu_fullscreen_img').attr("src","images/menu/enter_fullscreen.png").attr("title",$.i18n.t('menu.fullscreen.enter'));
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
     * Loads a sphere
     * @param id - The ID of the sphere to load
     * @param startAnimation - bool - Animate the entrance into the sphere
     */
    explore.loadSphere = function (id, startAnimation) {
        //Creates a div to add the sphere
        $('#explore').append($('<div/>', {
            id: 'sphere',
            class: 'fullsize invisible'
        }));
        var onReady = function () {
            $('#sphere').removeClass('invisible');
            $('#map').remove();
            $('#menu_map').css("display","block");
        };
        $.getJSON("/json/spheres/sphere_" + id + ".json", function (data) {
            explore.sphere.sphere = Object.create(explore.sphere.Sphere).init(data,onReady,startAnimation);
        });


        //var url = location.pathname;
        //var expectedUrl = "/sphere/" + id;
        //if (url !== expectedUrl) {
        //    history.pushState({}, "Sphere", "/sphere/" + id);
        //}
    };

    /**
     * 
     * @param id
     */
    explore.loadMap = function (id) {
        if(id === undefined) {
            if(explore.sphere.sphere === undefined) {
                id = "44c2e9bdcaf4c29b";
            } else {
                id = explore.sphere.sphere.getMap(0);
            }
        }
        $('#menu_map').css("display","none");
        $('#explore').append($('<div/>', {
            id: 'map',
            class: 'fullsize'
        }));
        $('#sphere').remove();
        $.getJSON("/json/maps/map_" + id + ".json", function (data) {
            $.getJSON("/json/maps/map_spheres_" + id + ".json", function (spheres) {
                explore.map.map = Object.create(explore.map.Map).init(data,spheres);
            });
        });

        //var url = location.pathname;
        //var expectedUrl = "/map/" + id;
        //if (url !== expectedUrl) {
        //    history.pushState({}, "Map", "/map/" + id);
        //}
    };

    var initLang = function() {
        $('#menu_fullscreen_img').attr("title",$.i18n.t('menu.fullscreen.enter'));
        $('#menu_resolution_img').attr("title",$.i18n.t(config.resolutions[config.res].name));
        $('#menu_language_img').attr("title",$.i18n.t(config.languages[config.lang].name));
        $('#menu_map_img').attr("title",$.i18n.t('menu.map'));
    };

    $(function() {
        $.i18n.init({lng: config.languages[config.lang].lang, resGetPath: '/locales/__lng__/__ns__.json'},initLang);
        $('#menu_resolution_img').attr("src",config.resolutions[config.res].image);
        $('#menu_language_img').attr("src",config.languages[config.lang].image);
        explore.loadMap();
    });

}(window));