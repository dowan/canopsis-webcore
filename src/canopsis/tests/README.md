# Tests Canopsis Brick

## Description

Test tools for Canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/tests.git
    $ cp -r tests $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable tests

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'tests'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/tests/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : c91ba4f.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/tests/src/testhelpers/createNewView.js<br>  29:5  error  "click" is not defined           no-undef<br>  30:5  error  "click" is not defined           no-undef<br>  32:5  error  "waitForElement" is not defined  no-undef<br>  33:9  error  "fillIn" is not defined          no-undef<br>  34:9  error  "click" is not defined           no-undef<br><br>✖ 5 problems (5 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 3 files (size: 20K)
Development version : 6 files (size: 32K)
