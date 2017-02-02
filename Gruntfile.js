/*jslint node: true*/
/*jslint unparam: true*/
let babel = require('rollup-plugin-babel');
let path = require('path');

module.exports = function (grunt) {
  "use strict";

  require('load-grunt-tasks')(grunt);

  var username = grunt.option('username'),
    password = grunt.option('password');

  grunt.initConfig({

    // __        __          _            _
    // \ \      / /   __ _  | |_    ___  | |__
    //  \ \ /\ / /   / _` | | __|  / __| | '_ \
    //   \ V  V /   | (_| | | |_  | (__  | | | |
    //    \_/\_/     \__,_|  \__|  \___| |_| |_|
    //      _                           ____                  _           _
    //     | |   __ _  __   __   __ _  / ___|    ___   _ __  (_)  _ __   | |_
    //  _  | |  / _` | \ \ / /  / _` | \___ \   / __| | '__| | | | '_ \  | __|
    // | |_| | | (_| |  \ V /  | (_| |  ___) | | (__  | |    | | | |_) | | |_
    //  \___/   \__,_|   \_/    \__,_| |____/   \___| |_|    |_| | .__/   \__|
    //                                                           |_|
    rollup: {
      options: {
        plugins: [
          babel(),
        ],
        format: 'cjs'
      },
      dist: {
        src: ['index.js'],
        dest: 'dist/index.js'
      }
    },
    uglify: {
      options: {
        mangle: true,
      },
      files: {
        src: ['dist/index.js'],
        dest: 'dist/index.min.js'
      }
    },
    //   ____   ____    ____
    //  / ___| / ___|  / ___|
    // | |     \___ \  \___ \
    // | |___   ___) |  ___) |
    //  \____| |____/  |____/
    sass: {
      options: {
        quiet: true
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/ng-rome.css': 'sass/rome.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'dist/ng-rome.css': 'sass/rome.sass'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ["last 2 versions", "> 1%", "ie 9"]
      },
      dist: {
        options: {},
        src: 'dist/ng-rome.css'
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer:dist',
    'rollup:dist',
    'uglify'
  ]);

};
