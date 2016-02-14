module.exports = function (grunt) {

    var marked = require('marked');
    var path = require('path');

    var markdownRenderer = new marked.Renderer();
    markdownRenderer.link = function(href, title, text) {
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

    grunt.registerMultiTask('markdown2html', 'Generates html files out of markdown.', function () {

        this.files.forEach(function (f) {

            // Concat banner + specified files + footer.
            f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    var md = grunt.file.read(filepath);
                    var html = marked(md, { renderer: markdownRenderer});
                    var destPath = filepath.split('/').slice(-2).join('/').split('.').slice(0,-1).join('.');
                    var dest = path.resolve(path.join(f.dest,destPath));
                    grunt.file.write(dest+'.html',html,{encoding: 'utf8'});
                }
            })

        });

    });

};