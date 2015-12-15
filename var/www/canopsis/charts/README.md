#  Canopsis Brick

## Description

Charts widgets for canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/charts.git
    $ cp -r charts $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/charts/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable charts

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'charts'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/charts/blob/master/doc/index.rst)
