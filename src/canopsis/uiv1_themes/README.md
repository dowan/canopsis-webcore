# Uiv1_themes Canopsis Brick

## Description

Provides legacy themes for widgets

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/uiv1_themes.git
    $ cp -r uiv1_themes $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/uiv1_themes/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable uiv1_themes

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'uiv1_themes'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/uiv1_themes/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :ok: OK |  |

## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 4 files (size: 24K)
Development version : 2 files (size: 20K)
