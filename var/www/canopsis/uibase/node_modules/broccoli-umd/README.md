# broccoli-umd

The broccoli-umd plugin exposes [libumd](https://github.com/bebraw/libumd)
functionality to wrap .js files.

This plugin is designed to compile a single, primary input file
into a single output file.

This code is based heavily on
[broccoli-less-single](https://github.com/gabrielgrant/broccoli-less-single)
and [grunt-umd](https://github.com/bebraw/grunt-umd/)

## Installation

```bash
npm install --save-dev broccoli-umd
```

## Usage

```js
var umdify = require('broccoli-umd');

var outputTree = umdify(sourceTrees, inputFile, outputFile, options)
```

* **`sourceTrees`**: An array of trees that act as the search paths for
  `inputFile`. If you have a single tree, pass `[tree]`.

* **`inputFile`**: Relative path of the main `.js` file to umdify. This
  file must exist in one of the `sourceTrees`.

* **`outputFile`**: Relative path of the output .js file.

* **`options`**: A hash of options for libumd.

### Example

```js
var livestamp = umdify("bower_components/livestampjs", "livestamp.js", "livestamp.js", {
  deps: {
    'default': ['jQuery', 'moment'],
    amd: ['jquery', 'moment']
  }
});
```
