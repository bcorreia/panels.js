module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // banner
        banner: '/**\n' +
                ' * <%= pkg.name %> - version <%= pkg.version %>\n' +
                // ' * <%= grunt.template.today("dd-mm-yyyy") %>\n' +
                ' *\n' +
                ' * <%= pkg.repository.url %>\n' +
                ' * <%= pkg.author.name %> - <%= pkg.author.email %>\n' +
                ' *\n' +
                ' */',

        // uglify
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                // banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            all: {
                files: {
                    'dist/panels.min.js': ['src/js/panels.js']
                }
            }
        },

        // copy
        copy: {
            all: {
                files: [
                    // includes files within path
                    { expand: true, flatten: true, src: ['src/js/panels.js'], dest: 'dist/', filter: 'isFile' }
                ],
            },
        },

        // banner
        usebanner: {
            all: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: [ 'dist/panels.min.js', 'dist/panels.js' ]
                }
            }
        },

        // concat
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */',
                separator: ';\n',
            },
            pkg: {
                src: ['dist/panels.min.js', 'packages/velocity/velocity.min.js'],
                dest: 'dist/panels.pkg.min.js',
            },
            pkgall: {
                src: ['dist/panels.min.js', 'packages/velocity/velocity.min.js', 'packages/handlebars/handlebars.min.js', 'packages/imagesloaded/imagesloaded.pkgd.min.js'],
                dest: 'dist/panels.pkg.all.min.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify'); // uglify
    grunt.loadNpmTasks('grunt-contrib-copy'); // copy
    grunt.loadNpmTasks('grunt-banner'); // banner
    grunt.loadNpmTasks('grunt-contrib-concat'); // concat

    // tasks
    grunt.registerTask('dist', [
        'uglify:all', 'copy:all', 'usebanner:all', 'concat:pkg', 'concat:pkgall'
    ]);
};