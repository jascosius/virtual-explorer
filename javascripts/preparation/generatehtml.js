var fs = require('fs');
var mkdirp = require('mkdirp');
var marked = require('marked');


exports.generate = function(markdown, fileName, outputDir) {

    if (!fs.existsSync(outputDir)) {
        mkdirp.sync(outputDir);
    }

    fileName = fileName.replace(/\.[^/.]+$/, "");

    var renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
        var out;
        if(href.substring(0,1) === '#') {
            href = href.substring(1);
            out = '<a href="javascript:void(0)" onclick="sphere.changePopup(\''+ href +'\');"'
        } else {
            out = '<a href="' + href + '" TARGET="_blank"';
        }
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };

    fs.writeFileSync(outputDir + '/' + fileName + '.html', marked(markdown, { renderer: renderer }));
};