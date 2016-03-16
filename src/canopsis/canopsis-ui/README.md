# Canopsis-ui Canopsis Brick

## Description

Provides objects and templates that are not technically required by the UI, but that are always provided with Canopsis to provide some functionnal aspects of a Canopsis application

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui.git
    $ cp -r canopsis-ui $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-ui

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-ui'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui/blob/master/doc/index.rst)

## Continuous Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 084c4b2.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR |  |


## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/reopens/views/application.js | uncomment while ready |


### FIXMES



## Additional info

Minified version : 5 files (size: 44K)
Development version : 6 files (size: 72K)
