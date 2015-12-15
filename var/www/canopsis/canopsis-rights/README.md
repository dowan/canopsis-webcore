# Is-rights Canopsis Brick

## Description

Rights and permission management

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-rights.git
    $ cp -r canopsis-rights $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-rights/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-rights

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-rights'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-rights/blob/master/doc/index.rst)
