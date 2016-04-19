# Canopsis-backend-ui-connector Canopsis Brick

## Description

Provides adapters to communicate with Canopsis backend

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-backend-ui-connector.git
    $ cp -r canopsis-backend-ui-connector $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-backend-ui-connector

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-backend-ui-connector'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-backend-ui-connector/blob/master/doc/index.rst)

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

| File   | Note   |
|--------|--------|
| src/serializers/ctx.js |: autodetect xtype |
| src/adapters/cservice.js |: do not use userPreferencesModelName |


### FIXMES



## Additional info

Minified version : 3 files (size: 36K)
Development version : 31 files (size: 148K)
