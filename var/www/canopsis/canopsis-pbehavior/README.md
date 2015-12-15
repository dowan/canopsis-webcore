# Is-pbehavior Canopsis Brick

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
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-pbehavior

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-pbehavior'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-pbehavior/blob/master/doc/index.rst)
