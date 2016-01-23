/* This module needs hugin and imagemagic

 */

var path = require('path');
var fs = require('fs-extra'); //TODO install
var mkdirp = require('mkdirp'); //TODO: Install
var cp = require("child_process");

var errorFunction = function(err, stdout, stderr) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
};

var rmdir = function(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm filename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

exports.generate = function(inputFile, outputDir, facesize) {
    console.log('Generating cubemap ...');
    targetextension = '.jpg';

    var tilesize = 2048; //256

    var dirname = path.dirname(inputFile);
    var basename = path.basename(inputFile);
    var extension = path.extname(basename);

    var tilesperrowcount = facesize / tilesize;
    var tilescount = tilesperrowcount * tilesperrowcount;
    var faces = ['pz', 'nx', 'nz', 'px', 'py', 'ny'];

    var tmpFolder = '/tmp/erect2cubemap';
    var ptoFile = tmpFolder + '/erect2cubemap.pto';
    var nonaOutput = tmpFolder + '/cubemap';

    if (!fs.existsSync(tmpFolder)) {
        mkdirp.sync(tmpFolder);
    }
    cp.execSync('erect2cubic --erect=' + path.resolve(inputFile) + ' --face=' + facesize + ' --ptofile=' + ptoFile, errorFunction);
    cp.execSync('nona -o ' + nonaOutput + ' ' + ptoFile, errorFunction);

    for (var i = 0; i < 6; i++) {
        var face = faces[i];
        var faceDir = outputDir + '/' + face;
        var convertInputFile = nonaOutput + '000' + i + '.tif';
        var convertOutputFile = nonaOutput + '.' + face + '.%d' + targetextension;
        if (!fs.existsSync(faceDir)) {
            mkdirp.sync(faceDir);
        }
        cp.execSync('convert ' + convertInputFile + ' -crop ' + tilesize + 'x' + tilesize + ' +repage ' + convertOutputFile,errorFunction);

        for (var j = 0; j < tilescount; j++) {
            var x = Math.floor(j / tilesperrowcount);
            var y = j % tilesperrowcount;
            fs.copySync(nonaOutput + '.' + face + '.' + j + targetextension, faceDir + '/' + x + '.' + y + targetextension);
        }

    }

    rmdir(tmpFolder);
};