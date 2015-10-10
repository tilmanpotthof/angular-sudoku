module.exports = function () {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  var ngtemplates = {};

  config.eachModule(function (module, moduleName) {
    if (!module.hasTemplates()) {
      return;
    }
    ngtemplates[moduleName] = {
      cwd: 'src',
      src: module.templates.src.replace(/^src\//, ''),
      dest: module.templates.dest
    };
  });

  return ngtemplates;
};
