module.exports = function (grunt) {

    var path = require('path');
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var cp = require("child_process");
    var math = require("mathjs");

    var errorFunction = function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    };

    var generatePreview = function (inputFile, outputDir, id, size, count, initial) {

        grunt.log.writeln('Generating preview ' + id + ' (' + size + 'x' + size + ').');

        //specify the output dir
        outputDir += '/' + id + '/preview/' + size;

        if (!fs.existsSync(outputDir)) {
            mkdirp.sync(outputDir);
        }

        var blender_file = path.resolve('extra/blender/sphere_shadeless.blend');
        var python_file = path.resolve('extra/blender/render_preview.py');

        //execute blender with a python script to generate preview
        cp.execSync('blender_texture=' + inputFile + ' blender_output=' + outputDir + ' blender_resolution=' + size + ' blender_steps=' + count + ' blender_initial=' + initial + ' blender -b ' + blender_file + ' --python ' + python_file + ' -F PNG -s 1 -e ' + count + ' -j 1 -t 0 -a -noaudio', errorFunction);

    };

    grunt.registerMultiTask('generatepreview', 'Generates previews out of images in equirectangular projection.', function () {

        var data = grunt.file.read(path.resolve('raw/config.json'));
        var config = JSON.parse(data);

        // Iterate over all src-dest file pairs.
        this.files.forEach(function (f) {

            // Concat banner + specified files + footer.
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    var id = filepath.split('/').slice(-2, -1);
                    var initial = 0;
                    var jsonPath = path.resolve(f.jsonPrefix + id + '.json');
                    if (!grunt.file.exists(jsonPath)) {
                        grunt.log.warn('No corresponding JSON file found. Set initial to 0.');
                    } else {
                        var jsonData = grunt.file.read(jsonPath);
                        var sphere = JSON.parse(jsonData);
                        if (sphere.initialView.long !== undefined) {
                            initial = -math.eval(sphere.initialView.long);
                        }
                    }
                    config.previewSizes.forEach(function (res) {
                        generatePreview(path.resolve(filepath), path.resolve(f.dest), id, res.size, res.count, initial);
                    });
                }
            })

        });

    });

};