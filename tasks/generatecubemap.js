module.exports = function (grunt) {

    var path = require('path');
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var cp = require("child_process");

    var errorFunction = function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    };

    var rmdir = function (dir) {
        var list = fs.readdirSync(dir);
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);

            if (filename == "." || filename == "..") {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm filename
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    };

    var generateCubemap = function (inputFile, outputDir, id, facesize) {

        grunt.log.writeln('Generating cubemap ' + id + ' (' + facesize + 'x' + facesize + ').');

        var tmp = '/tmp';
        var tilesize = facesize;
        var fileExtension = '.jpg';

        var tilesperrowcount = facesize / tilesize;
        var tilescount = tilesperrowcount * tilesperrowcount;
        var faces = ['pz', 'nx', 'nz', 'px', 'py', 'ny'];

        var tmpFolder = tmp + '/erect2cubemap';
        var ptoFile = tmpFolder + '/erect2cubemap.pto';
        var nonaOutput = tmpFolder + '/cubemap';

        //Create temp folder
        if (!fs.existsSync(tmpFolder)) {
            mkdirp.sync(tmpFolder);
        }

        //Convert equirectangular input file into 6 cubemap faces
        cp.execSync('erect2cubic --erect=' + inputFile + ' --face=' + facesize + ' --ptofile=' + ptoFile, errorFunction);
        cp.execSync('nona -o ' + nonaOutput + ' ' + ptoFile, errorFunction);

        for (var i = 0; i < 6; i++) {
            var face = faces[i];
            //specify output folder
            var faceDir = outputDir + '/' + id + '/cubemap/' + facesize + '/' + face;
            var convertInputFile = nonaOutput + '000' + i + '.tif';
            var convertOutputFile = nonaOutput + '.' + face + '.%d' + fileExtension;
            //create output folder
            if (!fs.existsSync(faceDir)) {
                mkdirp.sync(faceDir);
            }
            //convert the 6 cubemap faces into tiles with right resolutions
            cp.execSync('convert ' + convertInputFile + ' -crop ' + tilesize + 'x' + tilesize + ' +repage ' + convertOutputFile, errorFunction);

            for (var j = 0; j < tilescount; j++) {
                var x = Math.floor(j / tilesperrowcount);
                var y = j % tilesperrowcount;
                //copy (and rename) every tile into the output folder
                fs.writeFileSync(faceDir + '/' + x + '.' + y + fileExtension, fs.readFileSync(nonaOutput + '.' + face + '.' + j + fileExtension));
            }

        }

        rmdir(tmpFolder);

    };

    grunt.registerMultiTask('generatecubemap', 'Generates cubemaps out of images in equirectangular projection.', function () {

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
                    var id = filepath.split('/').slice(-2,-1);
                    config.cubemapSizes.forEach(function(res) {
                        generateCubemap(path.resolve(filepath), path.resolve(f.dest),id,res.size);
                    });
                }
            })

        });

    });

};