/**
 *
 * @param id - id of the html element
 */
var loadMap = function(id) {
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize'
    }));
    $.getJSON( "/json/maps/map_"+id+".json", function (data) {
        $.getJSON( "/json/maps/map_spheres_"+id+".json", function (spheres) {
            createMap(id,data,spheres);
        });
    });
};

var loadSphere = function(id) {
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize'
    }));
    $.getJSON( "/json/spheres/sphere_"+id+".json", function (data) {
        createSphere(id,data);
    });
};

var removeMap = function(id) {
    $('#'+id).remove();
};

$.i18n.init({ lng: "de-DE" });
loadMap("44c2e9bdcaf4c29b");



