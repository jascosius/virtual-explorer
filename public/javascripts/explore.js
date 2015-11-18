/**
 *
 * @param id - id of the html element
 */
var start_map = "44c2e9bdcaf4c29b";
var current_map = start_ap;

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

var removeMap = function(id) {
    $('#'+id).remove();
}

var loadSphere = function(id) {
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize invisible',
    }));
    $.getJSON( "/json/spheres/sphere_"+id+".json", function (data) {
        createSphere(id,data,photoSphereOnReady);
    });
    var photoSphereOnReady = function () {
        $("#"+id).removeClass('invisible')
        removeMap(current_map);
    };
};

$.i18n.init({ lng: "de-DE" });
loadMap(start_map);



