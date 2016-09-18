'use strict';

var Babel = require('babel-core');

module.exports = [{
  ext: '.js',
  transform: function transform(content, filename) {
    if (filename.indexOf('node_modules') === -1) {
      return Babel.transform(content, {
        filename: filename,
        sourceMap: 'inline',
        sourceFileName: filename
      }).code;
    }
    return content;
  }
}];