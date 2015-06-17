var umdify = require('broccoli-umd');
var concat = require('broccoli-concat');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJavaScript = require('broccoli-uglify-js');
var cleanCSS = require('broccoli-clean-css');
var gzipFiles = require('broccoli-gzip');

var concatenatedJS = concat('lib/externals', {
  inputFiles: [
    'iCheck/icheck.js',
    'ember-icheck/lib/component.js',
    'ember-tooltip/lib/component.js',
    'ember-durationcombo/lib/component.js',
    'bootstrap/dist/js/bootstrap.min.js',
    'jsoneditor/jsoneditor.js',
    'd3/d3.js',
    'summernote/dist/summernote.min.js',
    'ember-summernote/lib/component.js',
    'ember-datetimepicker/lib/component.js',
    'bootstrap-daterangepicker/daterangepicker.js',
    'ember-jsoneditor/ember-jsoneditor.js',
    'summernote/dist/summernote.js',
    'codemirror/lib/codemirror.js',
    'colpick/js/colpick.js'
    // 'kb-rrule/lib/nlp.js',
    // 'kb-rrule/lib/rrule.js'
  ],
  outputFile: '/built-libs/uibase-libs.min.js',
});

// concatenatedJS = uglifyJavaScript(concatenatedJS, {});
// concatenatedJS = gzipFiles(concatenatedJS, {extensions: ['js']});

var concatenatedCSS = concat('lib/externals', {
  inputFiles: [
    'jsoneditor/jsoneditor.css',
    'bootstrap/dist/css/bootstrap.min.css',
    'fontawesome/css/font-awesome.min.css',
    'bootstrap-daterangepicker/daterangepicker-bs3.css',
    'codemirror/theme/ambiance.css',
    'codemirror/lib/codemirror.css',
    'summernote/dist/summernote.css',
    'colpick/css/colpick.css',
    'iCheck/skins/all.css'
  ],
  outputFile: '/built-libs/css/uibase-libs.min.css',
})

var fontawesomeFonts = pickFiles('lib/externals', {
  srcDir: '/fontawesome',
  files: ['fonts/*'],
  destDir: '/built-libs'
});

var bootstrapFonts = pickFiles('lib/externals', {
  srcDir: '/bootstrap/dist',
  files: ['fonts/*'],
  destDir: '/built-libs'
});


concatenatedCSS = cleanCSS(concatenatedCSS);

module.exports = mergeTrees([concatenatedJS, concatenatedCSS, fontawesomeFonts, bootstrapFonts]);
