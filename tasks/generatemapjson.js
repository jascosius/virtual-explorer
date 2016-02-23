module.exports = function (grunt) {

    var path = require('path');
    var fs = require('fs');

    var generateMapJson = function (mapSphere,sphere, id, map) {

        grunt.log.writeln('Adding sphere ' + id + ' to map ' + map + '.');

        mapSphere.id = sphere.id;
        mapSphere.name = sphere.name;
        mapSphere.coords = sphere.coords;
        mapSphere.images = {};
        mapSphere.images.preview = sphere.images.preview;
        mapSphere.images.preview[128].count = 30; //TODO: flexible
    };

    grunt.registerMultiTask('generatemapjson', 'Generates one JSON file for each map out of all spheres.', function () {

        var maps = {};

        // Iterate over all src-dest file pairs.
        this.files.forEach(function (f) {

            // Concat banner + specified files + footer.
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    var jsonData = grunt.file.read(filepath);
                    var sphere = JSON.parse(jsonData);

                    for (var i=0; i<sphere.belongsToMap.length; i++) {
                        var map = sphere.belongsToMap[i];
                        if (maps[map] === undefined) {
                            maps[map] = {};
                        }
                        maps[map][sphere.id] = {};
                        generateMapJson(maps[map][sphere.id],sphere,sphere.id,map)
                    }

                }
            });

            for (var map in maps) {
                if(maps.hasOwnProperty(map)) {
                    var outputFile = path.resolve(f.dest) + '/map_spheres_' + map + '.json';
                    grunt.file.write(outputFile, JSON.stringify(maps[map]),{encoding: 'utf8'});
                }
            }
        });



    });

};