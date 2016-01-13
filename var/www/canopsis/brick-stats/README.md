# Stats Canopsis Brick

## Description

Provides statistics widgets

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/brick-stats.git
    $ cp -r brick-stats $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/brick-stats/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable brick-stats

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'brick-stats'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/brick-stats/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/brick-stats/src/widgets/stats-table/controller.js<br>  144:33  error  "__" is not defined             no-undef<br>  339:43  error  Unexpected trailing comma       comma-dangle<br>  425:21  error  "me" is defined but never used  no-unused-vars<br><br>✖ 3 problems (3 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES


