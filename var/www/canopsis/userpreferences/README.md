# Eferences Canopsis Brick

## Description

User preferences brick for canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/userpreferences.git
    $ cp -r userpreferences $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/userpreferences/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable userpreferences

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'userpreferences'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/userpreferences/blob/master/doc/index.rst)
