# Canopsis-backend-ui-connector Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Provides adapters to communicate with Canopsis backend

## Content

### adapters

 - profile
 - action
 - baseadapter
 - cancel
 - context
 - crecord
 - cservice
 - entitylink
 - eue
 - event
 - eventlog
 - filter
 - linklist
 - loggedaccount
 - pojo
 - Serie2
 - StatsFilter
 - Storage
 - trap
 - userview
 - userviewsimplemodel

### serializers

 - ctx
 - ctxcomponent
 - ctxmetric
 - ctxresource
 - ctxselector
 - ctxtopology
 - job
 - linklist
 - taskmail
 - ticket

### schemas

 - schema-curve
 - schema-rangecolor
 - schema-serie
 - schema-widgetpreferences



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install canopsis-backend-ui-connector

Then, you need to enable the brick

    $ ./bin/brickmanager enable canopsis-backend-ui-connector

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-backend-ui-connector'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-backend-ui-connector/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 3ca8f05.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :ok: OK |  |


## Code-Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/serializers/ctx.js |: autodetect xtype |
| src/adapters/cservice.js |: do not use userPreferencesModelName |


### FIXMES



## Additional-info

Minified version : 3 files (size: 44K)
Development version : 31 files (size: 148K)
