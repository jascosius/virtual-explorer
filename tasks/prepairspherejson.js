module.exports = function (grunt) {

    var path = require('path');

    var ids = [];

    var prepairSphere = function (newSphere, sphere) {

        newSphere.id = sphere.id;
        if (sphere.id === undefined) {
            grunt.fail.warn('There is a sphere without id!');
        }
        if (ids.indexOf(sphere.id) > -1) {
            grunt.fail.warn('ID ' + sphere.id + ' is not unique!');
        }
        ids.push(sphere.id);

        newSphere.belongsToMap = sphere.belongsToMap;
        if (sphere.belongsToMap === undefined || sphere.belongsToMap.length < 1) {
            grunt.fail.warn('Sphere ' + sphere.id + ' belongs to no map!');
        }

        newSphere.initialView = sphere.initialView;

        newSphere.name = sphere.name;

        newSphere.coords = sphere.coords;
        if (sphere.coords === undefined || sphere.coords.lat === undefined || sphere.coords.long === undefined) {
            grunt.fail.warn('Some coords are missing for sphere ' + sphere.id + '.');
        }

        newSphere.arrows = sphere.arrows; //Todo: test arrow

        newSphere.infos = sphere.infos;

        newSphere.objects = sphere.objects;


    };

    grunt.registerMultiTask('perpairspherejson', 'Prepairs and checks sphere json files for production.', function () {

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

                    var newSphere = {};

                    prepairSphere(newSphere, sphere);

                    var destPath = filepath.split('/').slice(-1).join('/');
                    var dest = path.resolve(path.join(f.dest, destPath));
                    grunt.file.write(dest, JSON.stringify(newSphere), {encoding: 'utf8'});

                }
            });
        });

    });

};