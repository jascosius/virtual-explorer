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
    explore.config.lang = "de-DE";
    explore.config.preview = "256";
    explore.config.cubemap = "1024";

    /**
     * Causes the Browser to toogle fullscreen
     */
    explore.toogleFullscreen = function() {
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
        var callback = function (sphere_id) {
            explore.loadSphere(sphere_id, true);
        };
        $('#explore').append($('<div/>', {
            id: 'map',
            class: 'fullsize'
        }));
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

}(window));