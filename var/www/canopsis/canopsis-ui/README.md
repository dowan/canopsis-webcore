# Is-ui Canopsis Brick

## Description

Provides objects and templates that are not technically required by the UI, but that are always provided with Canopsis to provide some functionnal aspects of a Canopsis application

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui.git
    $ cp -r canopsis-ui $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-ui/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-ui

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-ui'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui/blob/master/doc/index.rst)
