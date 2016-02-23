(function(window){
    "use strict";
    if(window.explore === undefined) {
        window.explore = {};
    }
    window.console.log('main.js');
    var explore = window.explore;
    var $ = window.$;

    explore.fullscreen = function() {

    };

    explore.loadSphere = function (id, startAnimation) {

        $('#explore').append($('<div/>', {
            id: 'sphere',
            class: 'fullsize invisible'
        }));
        var onReady = function () {
            $("#" + id).removeClass('invisible');
            removeMap(current_map);
        };
        $.getJSON("/json/spheres/sphere_" + id + ".json", function (data) {
            explore.sphere.sphere = Object.create(explore.sphere.Sphere);
            explore.sphere.sphere.init(data,$('#sphere'),onReady,startAnimation);
        });


        //var url = location.pathname;
        //var expectedUrl = "/sphere/" + id;
        //if (url !== expectedUrl) {
        //    history.pushState({}, "Sphere", "/sphere/" + id);
        //}
    };

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
                explore.map.map = Object.create(explore.map.Map);
                explore.map.map.init();
            });
        });

        //var url = location.pathname;
        //var expectedUrl = "/map/" + id;
        //if (url !== expectedUrl) {
        //    history.pushState({}, "Map", "/map/" + id);
        //}
    };

}(window));