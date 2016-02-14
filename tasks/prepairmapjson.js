module.exports = function (grunt) {

    var path = require('path');

    var ids = [];

    var prepairMap = function (newMap, map) {

        newMap.id = map.id;
        if (map.id === undefined) {
            grunt.fail.warn('There is a map without id!');
        }
        if (ids.indexOf(map.id) > -1) {
            grunt.fail.warn('ID ' + map.id + ' is not unique!');
        }
        ids.push(map.id);




    };

    grunt.registerMultiTask('perpairmapjson', 'Prepairs and checks map json files for production.', function () {

        this.files.forEach(function (f) {

            // Concat banner + specified files + footer.
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    var jsonData = grunt.file.read(filepath);
                    var map = JSON.parse(jsonData);

                    var newMap = {};

                    prepairMap(newMap, map);

                    var destPath = filepath.split('/').slice(-1).join('/');
                    var dest = path.resolve(path.join(f.dest, destPath));
                    grunt.file.write(dest, JSON.stringify(newMap), {encoding: 'utf8'});

                }
            });
        });

    });

};