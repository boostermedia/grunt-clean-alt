/*
 * grunt-contrib-clean
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';

var rimraf = require('rimraf');

module.exports = function(grunt) {

  function clean(filepath, options, cb) {
    if (!grunt.file.exists(filepath)) {
      return false;
    }

    // Only delete cwd or outside cwd if --force enabled. Be careful, people!
    if (!options.force) {
      if (grunt.file.isPathCwd(filepath)) {
        grunt.verbose.error();
        grunt.fail.warn('Cannot delete the current working directory.');
        return false;
      } else if (!grunt.file.isPathInCwd(filepath)) {
        grunt.verbose.error();
        grunt.fail.warn('Cannot delete files outside the current working directory.');
        return false;
      }
    }

    try {
      // Actually delete. Or not.
      if (!options['no-write']) {
        if (options.async) {
          rimraf(filepath, cb);
        }
        else
        {
          rimraf.sync(filepath);
        }
      }
      grunt.verbose.writeln((options['no-write'] ? 'Not actually cleaning ' : 'Cleaning ') + filepath + (options.async ? '(asynchronously)' : '(synchronously)') +'...');
    } catch (e) {
      grunt.log.error();
      grunt.fail.warn('Unable to delete "' + filepath + '" file (' + e.message + ').', e);
    }
  }

  grunt.registerMultiTask('clean', 'Clean files and folders.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: grunt.option('force') === true,
      'no-write': grunt.option('no-write') === true,
      async: false
    });

    var done;
    if (options.async) done = this.async();

    // Clean specified files / dirs.
    this.filesSrc.forEach(function(filepath) {
      if (options.async) {
        clean(filepath, options, done);
      }
      else
      {
        clean(filepath, options);
      }
    });
    grunt.log.ok(this.filesSrc.length  + ' ' + grunt.util.pluralize(this.filesSrc.length, 'path/paths') + ' cleaned.');
  });

};
