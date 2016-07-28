# Stats Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Provides statistics widgets

## Content

### widgets

 - Statstable

### schemas

 - schema-statstable



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install brick-stats

Then, you need to enable the brick

    $ ./bin/brickmanager enable brick-stats

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'brick-stats'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/brick-stats/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 5277306.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/brick-stats/src/widgets/stats-table/controller.js<br>  144:33  error  "__" is not defined             no-undef<br>  339:43  error  Unexpected trailing comma       comma-dangle<br>  425:21  error  "me" is defined but never used  no-unused-vars<br><br>✖ 3 problems (3 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS



### FIXMES



## Additional-info

Minified version : 4 files (size: 40K)
Development version : 2 files (size: 44K)
