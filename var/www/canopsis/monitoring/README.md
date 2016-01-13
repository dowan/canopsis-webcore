# Monitoring Canopsis Brick

## Description

Monitoring-related features for Canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/monitoring.git
    $ cp -r monitoring $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/monitoring/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable monitoring

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'monitoring'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/monitoring/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :ok: OK |  |

## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/mixins/sendevent.js | refactor into sub classes |
| src/widgets/weather/controller.js | avoid using 0 as limit. A better practivce should be used, like limiting to 1000 and display a warning if payload.length > 1000 |


### FIXMES

| File   | Note   |
|--------|--------|
| src/components/cfiltereditor/component.js | Canopsis object is not accessible anymore |

