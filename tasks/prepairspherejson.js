module.exports = function (grunt) {

    var path = require('path');

    var ids = [];

    var prepairSphere = function (newSphere, sphere, config) {

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

        newSphere.images = {};
        newSphere.images.cubemap = {};
        config.cubemapSizes.forEach(function (res) {
            var img = res.path.replace("$id$", sphere.id);
            newSphere.images.cubemap[res.size] = {size: res.size, path: img};
            var resImg = path.resolve(path.join('public/',img));
            if(!grunt.file.exists(resImg)) {grunt.fail.warn(resImg + ' does not exist!')}
        });
        newSphere.images.preview = {};
        config.previewSizes.forEach(function (res) {
            var img = res.path.replace("$id$", sphere.id);
            newSphere.images.preview[res.size] = {size: res.size, path: img, count: res.count};
            var resImg = path.resolve(path.join('public/',img));
            if(!grunt.file.exists(resImg)) {grunt.fail.warn(resImg + ' does not exist!')}
        });

        newSphere.arrows = sphere.arrows; //Todo: test arrow

        newSphere.infos = sphere.infos;

        newSphere.objects = sphere.objects;
    };

    grunt.registerMultiTask('prepairspherejson', 'Prepairs and checks sphere json files for production.', function () {

        var data = grunt.file.read(path.resolve('raw/config.json'));
        var config = JSON.parse(data);

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

                    prepairSphere(newSphere, sphere, config);

                    var destPath = filepath.split('/').slice(-1).join('/');
                    var dest = path.resolve(path.join(f.dest, destPath));
                    grunt.file.write(dest, JSON.stringify(newSphere,null,4), {encoding: 'utf8'});

                }
            });
        });

    });

};