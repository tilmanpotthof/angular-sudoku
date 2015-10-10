module.exports = {
  options: {
    dest: 'generated/docs',
    title: 'angular-workshop-setup',
    scripts: [
      '//localhost:35729/livereload.js',
      'generated/dist/vendor/vendor.js',
      'generated/dist/vendor/docsVendor.js'
    ],
    styles: [
    ],
    editExample: false,
    sourceLink: true
  },
  all: ['src/**/*.js']
};
