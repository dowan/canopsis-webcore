# Canopsis-pbehavior Canopsis Brick

## Description

Periodic Behavior interface for Canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-pbehavior.git
    $ cp -r canopsis-pbehavior $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-pbehavior/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-pbehavior

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-pbehavior'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-pbehavior/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-pbehavior/src/adapters/pbehavior.js<br>  27:13  error  "get" is defined but never used  no-unused-vars<br>  28:13  error  "set" is defined but never used  no-unused-vars<br>  50:27  error  Strings must use singlequote     quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-pbehavior/src/components/periodicbehaviormanager/component.js<br>  21:10  error  Strings must use singlequote                             quotes<br>  28:13  error  Expected indentation of 8 space characters but found 12  indent<br>  28:13  error  "__" is not defined                                      no-undef<br>  86:42  error  "__" is not defined                                      no-undef<br>  87:40  error  "__" is not defined                                      no-undef<br>  88:40  error  "__" is not defined                                      no-undef<br>  89:43  error  "__" is not defined                                      no-undef<br>  90:44  error  "__" is not defined                                      no-undef<br><br>✖ 11 problems (11 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 5 files (size: 28K)
Development version : 5 files (size: 44K)
