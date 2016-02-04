# Tests Canopsis Brick

## Description

Test tools for Canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/tests.git
    $ cp -r tests $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/tests/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db

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

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :ok: OK |  |

## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 3 files (size: 20K)
Development version : 4 files (size: 24K)
