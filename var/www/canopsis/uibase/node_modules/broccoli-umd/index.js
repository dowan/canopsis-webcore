var umdify = require('libumd');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var includePathSearcher = require('include-path-searcher');
var CachingWriter = require('broccoli-caching-writer');
var _ = require('lodash');
var RSVP = require('rsvp');

module.exports = UmdCompiler;

function regexQuote (str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}

function UmdCompiler (sourceTrees, inputFile, outputFile, options) {
  if (!(this instanceof UmdCompiler)) {
    return new UmdCompiler(sourceTrees, inputFile, outputFile, options);
  }

  var includeFilter = regexQuote(inputFile);
  CachingWriter.call(this, arguments[0], [includeFilter]);

  this.inputFile = inputFile;
  this.outputFile = outputFile;
  this.umdOptions = options || {};
}

UmdCompiler.prototype = Object.create(CachingWriter.prototype);
UmdCompiler.prototype.constructor = UmdCompiler;

UmdCompiler.prototype.updateCache = function (srcDir, destDir) {
  var srcFile = includePathSearcher.findFileSync(this.inputFile, srcDir);
  var destFile = path.join(destDir, this.outputFile);
  var umdOptions = this.umdOptions;
  mkdirp.sync(path.dirname(destFile));

  var input = fs.readFileSync(srcFile, 'utf8');

  return new RSVP.Promise(function(resolve, reject) {
    var output = umdify(input, umdOptions);

    fs.writeFile(destFile, output, {encoding: 'utf8'}, function (err) {
      if (err) {
        return reject(err);
      }

      return resolve(output);
    });

  }, function (err) {
    reject(err);
  });
};
