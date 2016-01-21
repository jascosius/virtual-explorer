// Require the nodejs file system library
var fs = require('fs');
var path = require('path');
var spherePath = path.resolve('public/json/spheres');
var mapPath = path.resolve('public/json/maps/map_spheres_44c2e9bdcaf4c29b.json');

exports.prepair = function() {
// Readdir reads a path and gives an array of filenames
// to the callback handleFiles.
    fs.readdir(spherePath, handleSphereFiles);
};

var handleSphereFiles = function(err, files) {
    if (err) throw err;
    var i;
    var jsonFilePattern = /\.[json]+$/i;
    var fileName;
    var filePath;
    // Tells fs to read an utf-8 file.
    var fileReadOptions = {
        'encoding': 'utf-8'
    };
    var mapData = {};

    for (i = 0; i < files.length; ++i) {
        fileName = files[i];
        // Check if the file has a .json extension
        if (fileName.match(jsonFilePattern)) {
            filePath = spherePath + '/' + fileName;
            // Open the file as utf-8 and call handleJsonFile back
            // when done reading.
            var data = fs.readFileSync(filePath, fileReadOptions);

            var sphere = JSON.parse(data);

            //creates the spheres json object
            // including the id, name, longitude, latitude of each sphere_...json object
            mapData[sphere.id] = {};
            mapData[sphere.id].id = sphere.id;
            mapData[sphere.id].name = sphere.name;
            mapData[sphere.id].longitude = sphere.longitude;
            mapData[sphere.id].latitude = sphere.latitude;
            mapData[sphere.id].icons = sphere.image.icons;
            mapData[sphere.id].iconcount = 30; //TODO: flexible

            checkCubemap(sphere);
            checkIcons(sphere);
        }
    }

    //writes the generated newSphere object to the map_spheres....json file
    fs.writeFileSync(mapPath, JSON.stringify(mapData));
};

var checkCubemap = function(sphere) {
    var erect2cubemap = require(path.resolve('javascripts/preparation/erect2cubemap.js'));
    var cubemapPath = path.resolve('public'+sphere.image.cubemap);
    try {
        fs.lstatSync(cubemapPath);
    } catch(e){
        var inputFile = path.resolve('public'+sphere.image.erect);
        erect2cubemap.generate(inputFile,cubemapPath,2048);
    }
};

var checkIcons = function(sphere) {
    var generatespherepreview = require(path.resolve('javascripts/preparation/generatespherepreview.js'));
    var iconPath = path.resolve('public' + sphere.image.icons);
    try {
        fs.lstatSync(iconPath);
    } catch(e){
        var inputFile = path.resolve('public'+sphere.image.erect);
        generatespherepreview.generate(inputFile,iconPath,0);
    }
};