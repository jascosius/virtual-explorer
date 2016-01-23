/* This module needs python and blender

 */

var cp = require("child_process");
var fs = require('fs'); //TODO install
var path = require("path");
var mkdirp = require('mkdirp'); //TODO: Install

var errorFunction = function (err, stdout, stderr) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
};

exports.generate = function (texture,output_path,initial) {
    console.log('Generating icons ...');

    if (!fs.existsSync(output_path)) {
        mkdirp.sync(output_path);
    }

    //var texture = 'erect.jpg';
    //var output_path = '/dir';
    var steps = 30;
    //var initial = Math.PI / 2;
    var blender_file = path.resolve('extra/blender/sphere_shadeless.blend');
    var python_file = path.resolve('extra/blender/render_preview.py');

    cp.execSync('blender_texture=' + texture + ' blender_output=' + output_path + ' blender_steps=' + steps + ' blender_initial=' + initial + ' blender -b ' + blender_file + ' --python ' + python_file + ' -F PNG -s 1 -e ' + steps + ' -j 1 -t 0 -a -noaudio', errorFunction);

};