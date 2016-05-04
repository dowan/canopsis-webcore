# Userpreferences Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

User preferences brick for canopsis

## Content



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install userpreferences

Then, you need to enable the brick

    $ ./bin/brickmanager enable userpreferences

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'userpreferences'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/userpreferences/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 3ca8f05.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/userpreferences/src/components/userpreferencesmanager/component.js<br>   21:10  error  Strings must use singlequote                              quotes<br>   56:47  error  Unexpected trailing comma                                 comma-dangle<br>  106:43  error  "data" is defined but never used                          no-unused-vars<br>  109:25  error  Expected indentation of 28 space characters but found 24  indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/userpreferences/src/mixins/userconfiguration.js<br>   36:41  error  "options" is defined but never used                       no-unused-vars<br>   65:49  error  Strings must use singlequote                              quotes<br>   66:50  error  Strings must use singlequote                              quotes<br>   86:34  error  "data" is defined but never used                          no-unused-vars<br>  111:65  error  Strings must use singlequote                              quotes<br>  148:14  error  Expected indentation of 12 space characters but found 13  indent<br>  149:17  error  Expected indentation of 17 space characters but found 16  indent<br>  151:17  error  Expected indentation of 17 space characters but found 16  indent<br>  153:17  error  Expected indentation of 17 space characters but found 16  indent<br>  155:17  error  Expected indentation of 17 space characters but found 16  indent<br>  179:54  error  Strings must use singlequote                              quotes<br>  193:13  error  Expected indentation of 13 space characters but found 12  indent<br><br>✖ 16 problems (16 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS



### FIXMES



## Additional-info

Minified version : 4 files (size: 32K)
Development version : 3 files (size: 40K)
