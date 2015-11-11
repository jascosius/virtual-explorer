// Require the nodejs file system library
var fs = require('fs');
var spherePath = './public/json/spheres';
var mapPath = './public/json/maps/map_spheres_44c2e9bdcaf4c29b.json';

// Readdir reads a path and gives an array of filenames
// to the callback handleFiles.
fs.readdir(spherePath, handleSphereFiles);

newSphere = {};

function handleSphereFiles(err, files) {
    if (err) throw err;
    var i;
    var jsonFilePattern = /\.[json]+$/i;
    var fileName;
    var filePath;
    // Tells fs to read an utf-8 file.
    var fileReadOptions = {
        'encoding': 'utf-8'
    };
    console.log(files);

    for (i = 0; i < files.length; ++i) {
        fileName = files[i];
        // Check if the file has a .json extension
        if (fileName.match(jsonFilePattern)) {
            filePath = spherePath + '/' + fileName;
            // Open the file as utf-8 and call handleJsonFile back
            // when done reading.
            var data = fs.readFileSync(filePath, fileReadOptions);

            var dataObject = JSON.parse(data);

            newSphere[dataObject.id] = {};
            newSphere[dataObject.id].name = dataObject.name;
            newSphere[dataObject.id].longitude = dataObject.longitude;
            newSphere[dataObject.id].latitude = dataObject.latitude;
        }
    }

    //writes the generated newSphere object to the sphereData.json file
    fs.writeFileSync(mapPath, JSON.stringify(newSphere))
}



