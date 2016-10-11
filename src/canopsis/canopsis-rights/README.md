# Canopsis-rights Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Rights and permission management

## Content



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install canopsis-rights

Then, you need to enable the brick

    $ ./bin/brickmanager enable canopsis-rights

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-rights'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-rights/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR |  |


## Code-Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/components/right-checksum/component.js | not used anymore? check and delete this property if possible |
| src/reopens/adapters/userview.js | Add the correct right to the current user, to allow him to display the view |
| src/reopens/adapters/userview.js | the right already exists, it's an update |
| src/reopens/adapters/userview.js | replace the userview name if it has changed |
| src/reopens/adapters/userview.js | delete user right in payload |


### FIXMES

| File   | Note   |
|--------|--------|
| src/components/rights-action/component.js | don't use _data, it might lead to unpredictable behaviours! |
| src/components/right-checksum/component.js | don't use "_data"! |
| src/reopens/routes/authenticated.js | use store#adapterFor |


## Additional-info

Minified version : 4 files (size: 56K)
Development version : 28 files (size: 208K)
