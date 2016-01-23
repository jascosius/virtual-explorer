exports.generate = function(sphere,mapData){
    console.log('Generating map JSON '+sphere.id+' ...');
    //creates the spheres json object
    // including the id, name, longitude, latitude of each sphere_...json object
    mapData[sphere.id] = {};
    mapData[sphere.id].id = sphere.id;
    mapData[sphere.id].name = sphere.name;
    mapData[sphere.id].coords = sphere.coords;
    mapData[sphere.id].images = {};
    mapData[sphere.id].images.icons = sphere.images.icons;
    mapData[sphere.id].images.icons.r128.count = 30; //TODO: flexible
};
