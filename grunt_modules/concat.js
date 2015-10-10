module.exports = function() {
  'use strict';

  var config = require('./config/config.js');
  var _ = require('underscore');

  var concatOptions = {
    vendor: {
      src: config.npmComponents,
      dest: 'generated/dist/vendor/vendor.js'
    },
    docsVendor: {
      src: config.npmDocsComponents,
      dest: 'generated/dist/vendor/docsVendor.js'
    }
  };

  config.eachModule(function(module, moduleName) {
    concatOptions[moduleName] = {
      src: module.getSourcesWithDependencies(),
      dest: module.dest

    };
  });

  return concatOptions;
};
