module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: 'public/javascripts/*.js',
                dest: 'dist/built.js'
            }
        },
        watch: {
            scripts: {
                files: ['public/javascripts/*.js'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'watch']);
};