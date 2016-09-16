# Canopsis-pbehavior Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Periodic Behavior interface for Canopsis

## Content

### adapters

 - pbehavior



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install canopsis-pbehavior

Then, you need to enable the brick

    $ ./bin/brickmanager enable canopsis-pbehavior

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-pbehavior'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-pbehavior/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 3ca8f05.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-pbehavior/src/adapters/pbehavior.js<br>  27:13  error  "get" is defined but never used  no-unused-vars<br>  28:13  error  "set" is defined but never used  no-unused-vars<br>  50:27  error  Strings must use singlequote     quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-pbehavior/src/components/periodicbehaviormanager/component.js<br>  21:10  error  Strings must use singlequote                             quotes<br>  28:13  error  Expected indentation of 8 space characters but found 12  indent<br>  28:13  error  "__" is not defined                                      no-undef<br>  86:42  error  "__" is not defined                                      no-undef<br>  87:40  error  "__" is not defined                                      no-undef<br>  88:40  error  "__" is not defined                                      no-undef<br>  89:43  error  "__" is not defined                                      no-undef<br>  90:44  error  "__" is not defined                                      no-undef<br><br>✖ 11 problems (11 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS



### FIXMES



## Additional-info

Minified version : 5 files (size: 28K)
Development version : 5 files (size: 44K)
