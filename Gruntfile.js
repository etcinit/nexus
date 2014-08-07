module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'browser/*.js',
                    'browser/*/**.js'
                ],
                dest: 'public/js/app.js'
            }
        },

        sass: {
            options: {
                includePaths: ['public/components/foundation/scss', 'public/components/foundation-icon-fonts']
            },

            dist: {
                options: {
                    outputStyle: 'compressed'
                },

                files: {
                    'public/css/app.css': 'scss/app.scss'
                }
            }
        },

        autoprefixer: {
            options: {

            },

            dist: {
                src: 'public/css/app.css',
                dest: 'public/css/app.css'
            }
        },

        watch: {
            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass', 'autoprefixer']
            },

            js: {
                files: 'browser/**/*.js',
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['sass', 'autoprefixer', 'concat', 'watch']);
};