# Monitoring Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Monitoring-related features for Canopsis

## Content

### components

 - ack
 - eventSelector
 - stateeditor
 - statemapping

### functions

 - buildBeforeModelPromises

### widgets

 - weather

### editors

 - editor-cfilter
 - editor-cfilterwithproperties
 - editor-cmetric
 - editor-eventselector

### renderers

 - renderer-cfilter
 - renderer-cfilterwithproperties

### schemas

 - schema-recordinfopopup
 - schema-weather



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install monitoring

Then, you need to enable the brick

    $ ./bin/brickmanager enable monitoring

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'monitoring'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/monitoring/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 3ca8f05.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/monitoring/src/forms/ack/controller.js<br>  34:121  error  Missing semicolon  semi<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/monitoring/src/helpers/criticity.js<br>  37:9  error  Expected indentation of 12 space characters but found 8  indent<br>  38:9  error  Expected indentation of 12 space characters but found 8  indent<br>  39:9  error  Expected indentation of 12 space characters but found 8  indent<br>  40:9  error  Expected indentation of 12 space characters but found 8  indent<br>  48:5  error  Expected indentation of 8 space characters but found 4   indent<br>  49:5  error  Expected indentation of 8 space characters but found 4   indent<br>  50:5  error  Expected indentation of 8 space characters but found 4   indent<br>  51:5  error  Expected indentation of 8 space characters but found 4   indent<br>  52:5  error  Expected indentation of 8 space characters but found 4   indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/monitoring/src/reopens/routes/application.js<br>  27:13  error  "set" is defined but never used  no-unused-vars<br><br>✖ 11 problems (11 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/mixins/sendevent.js | use an adapter for this |
| src/mixins/sendevent.js | refactor into sub classes |
| src/widgets/weather/controller.js | avoid using 0 as limit. A better practivce should be used, like limiting to 1000 and display a warning if payload.length > 1000 |


### FIXMES

| File   | Note   |
|--------|--------|
| src/components/cfiltereditor/component.js | Canopsis object is not accessible anymore |


## Additional-info

Minified version : 26 files (size: 196K)
Development version : 48 files (size: 356K)
