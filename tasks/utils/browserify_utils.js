var glob = require('glob');
var path = require('path');
var aliases = require('./javascript_aliases');
var isDev = global.isDev;
process.env.BUGSNAG_APP_VERSION = require('../../package.json').version;

var vendorLibs = [
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'handlebars',
  'backbone-deep-model',
  'backbone.layoutmanager',
  'backbone.localstorage',
  'bugsnag-js',
  'filesaver.js',
  // 'jquery-ui',
  'jquery-ui-touch-punch',
  'q',
  'underscore-deep-extend',
  'filedrop'
];

var additionalHbsfyRequires = glob
  .sync('./public/scripts/**/*_handlebars_helpers.js')
  .reduce(function(memo, file) {
    return memo + ' require("'+path.resolve(file)+'");';
  }, '');

var appTransforms = [
  [ 'jstify', {minifierOpts: {collapseWhitespace: false}} ],
  [ 'hbsfy', {compiler: 'require("handlebars.mixed");' + additionalHbsfyRequires} ],
  [ 'babelify', {
    optional: [ 'runtime', 'es7.objectRestSpread' ]
  } ],
  [ 'aliasify', {aliases: aliases} ]
];

var vendorTransforms = [];

if(!isDev) {
  appTransforms.push(
    [ 'envify', {} ],
    [ 'uglifyify', { global: true } ]
  );

  vendorTransforms.push(
    [ 'uglifyify', { global: true } ]
  );
}

module.exports = {
  appTransforms: appTransforms,
  vendorTransforms: vendorTransforms,
  vendorLibs: vendorLibs,

  applyConfig: function(bundleType, browserified) {
    var transforms;

    if(bundleType === 'app') {
      browserified.external(vendorLibs);
      transforms = appTransforms;
    } else {
      browserified.require(vendorLibs);
      transforms = vendorTransforms;
    }

    browserified = transforms.reduce(function(b, t) {
      return b.transform(t[0], t[1]);
    }, browserified);

    return browserified;
  }
};