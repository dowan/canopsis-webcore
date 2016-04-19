# Uiv1_themes Canopsis Brick

## Description

Provides legacy themes for widgets

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install uiv1_themes

Then, you need to enable the brick

    $ ./bin/brickmanager enable uiv1_themes

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'uiv1_themes'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/uiv1_themes/blob/master/doc/index.rst)

## Continuous Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 60420c1.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :ok: OK |  |


## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 4 files (size: 20K)
Development version : 2 files (size: 20K)
