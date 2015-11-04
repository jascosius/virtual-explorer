var loadMap = function(id) {
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize'
    }));
    $.getJSON( "/json/maps/map_44c2e9bdcaf4c29b.json", function (data) {
        createMap(id,data);
    });
}

var loadSphere = function(id) {
    $('body').append($('<div/>', {
        id: id,
        class: 'fullsize'
    }));
    $.getJSON( "/json/spheres/sphere_"+id+".json", function (data) {
        createSphere(id,data);
    });
}

var removeMap = function(id) {
    $('#'+id).remove();
}

loadMap("44c2e9bdcaf4c29b");



