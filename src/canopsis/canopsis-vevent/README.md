# Canopsis-vevent Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

iCalendar Event support for Canopsis

## Content



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install canopsis-vevent

Then, you need to enable the brick

    $ ./bin/brickmanager enable canopsis-vevent

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-vevent'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-vevent/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 5277306.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-vevent/src/adapters/vevent.js<br>  27:13  error  "set" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-vevent/src/serializers/vevent.js<br>  24:9   error  "ContextSerializer" is not defined  no-undef<br>  26:26  error  "ContextSerializer" is not defined  no-undef<br><br>✖ 3 problems (3 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS



### FIXMES



## Additional-info

Minified version : 4 files (size: 20K)
Development version : 2 files (size: 20K)
