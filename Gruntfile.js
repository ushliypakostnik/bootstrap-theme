module.exports = function(grunt) {
    var frontendDir = './web';
    var bowerDir = frontendDir + '/bower_components';
    var staticDir = './output';

    var jsBaseFiles = [
        bowerDir + '/bootstrap/js/transition.js',
        bowerDir + '/bootstrap/js/alert.js',
        bowerDir + '/bootstrap/js/button.js',
        bowerDir + '/bootstrap/js/carousel.js',
        bowerDir + '/bootstrap/js/collapse.js',
        bowerDir + '/bootstrap/js/dropdown.js',
        bowerDir + '/bootstrap/js/modal.js',
        bowerDir + '/bootstrap/js/tooltip.js',
        bowerDir + '/bootstrap/js/popover.js',
        bowerDir + '/bootstrap/js/scrollspy.js',
        bowerDir + '/bootstrap/js/tab.js',
        bowerDir + '/bootstrap/js/affix.js'
    ];

    var jsFiles = function(){
        var result = [bowerDir + '/jquery/dist/jquery.js'];
        for (var i = 0; i < jsBaseFiles.length; i++) {
            result.push(jsBaseFiles[i]);
        }
        return result;
    }();

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            all: [staticDir + '/*'],
            test: [staticDir + '/tmpl_*.html',
                   staticDir + '/sandbox_*.html'],  // в выгрузке не нужны базовые файлы и файлы песочницы
        },

        uglify: {
            options: {
                mangle: true
            },
            prod: {
                files: [{
                    src: jsFiles,
                    dest: staticDir + '/js/app.min.js'
                }, {
                    src: [bowerDir + '/respond/dest/respond.src.js'],
                    dest: staticDir + '/js/respond.min.js'
                }]
            },
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: [{
                    src: jsFiles,
                    dest: staticDir + '/js/app.js'
                }]
            }
        },

        less: {
            prod: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: [{
                    src: frontendDir + '/less/styles.less',
                    dest: staticDir + '/css/styles.min.css'
                }, {
                    src: frontendDir + '/css/sys.css',
                    dest: staticDir + '/css/sys.min.css'
                }]
            },
            dev: {
                options: {
                    compress: false,
                    cleancss: true
                },
                files: [{
                    src: frontendDir + '/less/styles.less',
                    dest: staticDir + '/css/styles.css'
                }, {
                    src: frontendDir + '/css/sys.css',
                    dest: staticDir + '/css/sys.css'
                }]
            }
        },

        replace: {
            prod: {
                src: [staticDir + '/css/styles.min.css'],
                overwrite: true,
                replacements: [{
                    from: '../bower_components/bootstrap/fonts/',
                    to: '../fonts/glyphicons-halflings-regular/'
                }]
            }
        },

        copy: {
            prod: {
                files: [
                {
                    expand: true,
                    cwd: bowerDir + '/bootstrap/fonts/',
                    src: ['**'],
                    dest: staticDir + '/fonts/glyphicons-halflings-regular/'
                }, {
                    expand: true,
                    cwd: frontendDir + '/img/',
                    src: ['**'],
                    dest: staticDir + '/img/'
                }]
            }
        },

        preprocess: {
            prod: {
                options: {
                    context : {
                        NODE_ENV: 'production',
                        DEBUG: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: frontendDir + '/',
                    src: ['*.html'],
                    dest: staticDir + '/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-preprocess');

    grunt.registerTask('dev', [
        'clean:all',
        'uglify:prod',
        'uglify:dev',
        'less:prod',
        'less:dev',
        'replace',
        'copy',
        'preprocess',
        'clean:test'
    ]);

    grunt.registerTask('prod', [
        'clean:all',
        'uglify:prod',
        'less:prod',
        'replace',
        'copy',
        'preprocess',
        'clean:test'
    ]);
    grunt.registerTask('default', ['dev']);
};
