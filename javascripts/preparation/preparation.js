// Require the nodejs file system library
var fs = require('fs');
var path = require('path');
var math = require('mathjs'); //TODO: Install
var spherePath = path.resolve('public/json/spheres');
var mapPath = path.resolve('public/json/maps/map_spheres_44c2e9bdcaf4c29b.json');

var configPath = path.resolve('javascripts/preparation/config.json');
var fileReadOptions = {
    'encoding': 'utf-8'
};
var config;

exports.prepair = function() {
// Readdir reads a path and gives an array of filenames
// to the callback handleFiles.
    createConfig();
    var configJson = fs.readFileSync(configPath, fileReadOptions);
    config = JSON.parse(configJson);

    if(config.activate_preparation) {
        console.log('Prepair ...');
        fs.readdir(spherePath, handleSphereFiles);
    }
};

var handleSphereFiles = function(err, files) {
    if (err) throw err;
    var i;
    var jsonFilePattern = /\.[json]+$/i;
    var fileName;
    var filePath;
    // Tells fs to read an utf-8 file.
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

            if(config.generateMapJson) {
                checkMapJson(sphere, mapData);
            }
            if(config.generateCubemap) {
                checkCubemap(sphere);
            }
            if(config.generateSpherePreview) {
                checkIcons(sphere);
            }
        }
    }

    //writes the generated newSphere object to the map_spheres....json file
    fs.writeFileSync(mapPath, JSON.stringify(mapData));
};

var createConfig = function() {
    try {
        fs.lstatSync(configPath);
    } catch(e){
        console.log('No config found at \'' + configPath + '\'. Generating config ...');
        var config = {};
        config.activate_preparation = true;
        config.generateMapJson = true;
        config.generateCubemap = false;
        config.generateSpherePreview = false;

        fs.writeFileSync(configPath, JSON.stringify(config));
    }
};

var checkMapJson = function(sphere, mapData){
    var generateMapJson = require(path.resolve('javascripts/preparation/generatemapjson.js'));
    generateMapJson.generate(sphere, mapData);
};

var checkCubemap = function(sphere) {
    var erect2cubemap = require(path.resolve('javascripts/preparation/generatecubemap.js'));
    var cubemapPath = path.resolve('public'+sphere.image.cubemap);
    try {
        fs.lstatSync(cubemapPath);
    } catch(e){
        var inputFile = path.resolve('public'+sphere.image.erect);
        erect2cubemap.generate(inputFile,cubemapPath,2048);
    }
};

var checkIcons = function(sphere) {
    var generateSpherePreview = require(path.resolve('javascripts/preparation/generatespherepreview.js'));
    var iconPath = path.resolve('public' + sphere.image.icons);
    try {
        fs.lstatSync(iconPath);
    } catch(e){
        var initial = 0;
        if(sphere.initial !== undefined) {
            initial = math.eval(sphere.initial);
        }
        var inputFile = path.resolve('public'+sphere.image.erect);
        generateSpherePreview.generate(inputFile,iconPath,initial);
    }
};