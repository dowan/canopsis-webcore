# Is-backend-ui-connector Canopsis Brick

## Description

Provides adapters to communicate with Canopsis backend

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-backend-ui-connector.git
    $ cp -r canopsis-backend-ui-connector $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-backend-ui-connector/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-backend-ui-connector

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-backend-ui-connector'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-backend-ui-connector/blob/master/doc/index.rst)
