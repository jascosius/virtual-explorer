module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            images: {
                files: [
                    {
                        src: ['raw/images/leaflet/*'],
                        dest: 'public/images/leaflet',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['raw/images/objects/*'],
                        dest: 'public/images/objects',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['raw/images/menu/*'],
                        dest: 'public/images/menu',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            javascripts: {
                files: [
                    {
                        src: ['raw/javascripts/lib/*'],
                        dest: 'public/javascripts/lib',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            stylesheets: {
                files: [
                    {
                        src: ['raw/stylesheets/lib/*'],
                        dest: 'public/stylesheets/lib',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            locales: {
                files: [
                    {
                        src: ['raw/locales/de-DE/*'],
                        dest: 'public/locales/de-DE',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['raw/locales/en-UK/*'],
                        dest: 'public/locales/en-UK',
                        filter: 'isFile',
                        expand: true,
                        flatten: true
                    }
                ]
            }
        },
        concat: {
            style: {
                src: 'raw/stylesheets/*.less',
                dest: 'raw/tmp/style/style.less'
            },
            script: {
                src: ['raw/javascripts/*.js', 'raw/javascripts/sphere/*.js', 'raw/javascripts/map/*.js'],
                dest: 'raw/tmp/script/script.js'
            },
            scriptDev: {
                src: ['raw/javascripts/*.js', 'raw/javascripts/sphere/*.js', 'raw/javascripts/map/*.js'],
                dest: 'public/javascripts/script.js'
            }
        },
        jshint: {
            all: ['raw/javascripts/*.js'],
            options: {
                curly: true,
                eqnull: true,
                eqeqeq: true,
                undef: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            }
        },
        uglify: {
            script: {
                files: {
                    'public/javascripts/script.js': ['raw/tmp/script/script.js']
                }
            }
        },
        less: {
            style: {
                files: {
                    'raw/tmp/style/style.css': 'raw/tmp/style/style.less'
                }
            },
            styleDev: {
                files: {
                    'public/stylesheets/style.css': 'raw/tmp/style/style.less'
                }
            }
        },
        cssmin: {
            style: {
                files: {
                    'public/stylesheets/style.css': ['raw/tmp/style/style.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['raw/javascripts/*.js', 'raw/javascripts/sphere/*.js', 'raw/javascripts/map/*.js'],
                tasks: ['script']
            },
            styles: {
                files: ['raw/stylesheets/*.less'],
                tasks: ['style']
            },
            scriptsDev: {
                files: ['raw/javascripts/*.js', 'raw/javascripts/sphere/*.js', 'raw/javascripts/map/*.js'],
                tasks: ['scriptDev']
            },
            stylesDev: {
                files: ['raw/stylesheets/*.less'],
                tasks: ['styleDev']
            }
        },
        concurrent: {
            watch: ['watch:scripts', 'watch:styles'],
            watchDev: ['watch:scriptsDev', 'watch:stylesDev']
        },
        generatemapjson: {
            dist: {
                src: 'public/json/spheres/sphere_*.json',
                dest: 'public/json/maps'
            }
        },
        markdown2html: {
            dist: {
                src: 'raw/markdown/**/*.md',
                dest: 'public/infos'
            }
        },
        prepairspherejson: {
            dist: {
                src: 'raw/json/spheres/sphere_*.json',
                dest: 'public/json/spheres'
            }
        },
        prepairmapjson: {
            dist: {
                src: 'raw/json/maps/map_*.json',
                dest: 'public/json/maps'
            }
        },
        generatecubemap: {
            dist: {
                src: 'raw/images/spheres/**/equirectangular.jpg',
                dest: 'public/images/spheres'
            }
        },
        generatepreview: {
            dist: {
                src: 'raw/images/spheres/**/equirectangular.jpg',
                dest: 'public/images/spheres',
                jsonPrefix: 'raw/json/spheres/sphere_'
            }
        }
    });

    grunt.task.loadTasks('./tasks');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('style', ['concat:style', 'less:style', 'cssmin:style']);
    grunt.registerTask('styleDev', ['concat:style', 'less:styleDev']);
    grunt.registerTask('script', ['concat:script', 'uglify:script']);
    grunt.registerTask('scriptDev', ['concat:scriptDev']);
    grunt.registerTask('default', ['copy', 'script', 'style', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html', 'concurrent:watch']);
    grunt.registerTask('dev', ['copy', 'scriptDev', 'styleDev', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html', 'concurrent:watchDev']);
    grunt.registerTask('init', ['copy', 'script', 'style', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html']);
    grunt.registerTask('initDev', ['copy', 'scriptDev', 'styleDev', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html']);
    grunt.registerTask('all', ['copy', 'script', 'style', 'generatecubemap','generatepreview', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html']);
    grunt.registerTask('allDev', ['copy', 'scriptDev', 'styleDev', 'generatecubemap','generatepreview', 'prepairspherejson', 'prepairmapjson', 'generatemapjson', 'markdown2html']);

};