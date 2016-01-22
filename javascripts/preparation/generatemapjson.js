exports.generate = function(sphere,mapData){
    console.log('Generating map JSON '+sphere.id+' ...');
    //creates the spheres json object
    // including the id, name, longitude, latitude of each sphere_...json object
    mapData[sphere.id] = {};
    mapData[sphere.id].id = sphere.id;
    mapData[sphere.id].name = sphere.name;
    mapData[sphere.id].longitude = sphere.longitude;
    mapData[sphere.id].latitude = sphere.latitude;
    mapData[sphere.id].icons = sphere.image.icons;
    mapData[sphere.id].iconcount = 30; //TODO: flexible
};
