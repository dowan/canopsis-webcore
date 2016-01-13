# Canopsis-vevent Canopsis Brick

## Description

iCalendar Event support for Canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-vevent.git
    $ cp -r canopsis-vevent $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-vevent/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-vevent

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-vevent'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-vevent/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-vevent/src/adapters/vevent.js<br>  27:13  error  "set" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-vevent/src/serializers/vevent.js<br>  24:9   error  "ContextSerializer" is not defined  no-undef<br>  26:26  error  "ContextSerializer" is not defined  no-undef<br><br>✖ 3 problems (3 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES


