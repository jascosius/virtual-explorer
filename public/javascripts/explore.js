/**
 *
 * @param id - id of the html element
 */
var start_map = "44c2e9bdcaf4c29b";
var current_map = start_map;
var current_sphere;

$.i18n.init({ lng: "de-DE" ,resGetPath: '/locales/__lng__/__ns__.json'});

var loadMap = function(id) {

    current_map = id;
    var callback = function(sphere_id){
        loadSphere(sphere_id,true);
    };
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize'
    }));
    $.getJSON( "/json/maps/map_"+id+".json", function (data) {
        $.getJSON( "/json/maps/map_spheres_"+id+".json", function (spheres) {
            createMap(id,data,spheres,callback);
        });
    });

    var url = location.pathname;
    var expectedUrl = "/map/" + id;
    if (url !== expectedUrl) {
        history.pushState({}, "Map", "/map/" + id);
    }
};

var removeMap = function(id) {
    $('#'+id).remove();
};

var loadSphere = function(id,startAnimation) {
    current_sphere = id;
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize invisible'
    }));
    $.getJSON( "/json/spheres/sphere_"+id+".json", function (data) {
        createSphere(id,data,photoSphereOnReady,startAnimation);
    });
    var photoSphereOnReady = function () {
        $("#"+id).removeClass('invisible');
        removeMap(current_map);
    };

    var url = location.pathname;
    var expectedUrl = "/sphere/" + id;
    if (url !== expectedUrl) {
        history.pushState({}, "Sphere", "/sphere/" + id);
    }
};

if (type === 'map'){
    loadMap(id);
}else if (type === 'sphere'){
    loadSphere(id,false);
}else if (type === 'not specified'){
    loadMap(start_map);
}
