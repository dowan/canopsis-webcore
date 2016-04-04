# Core Canopsis Brick

## Description

Core UI brick. Provides the base application layer for the Canopsis UI

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/core.git
    $ cp -r core $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable core

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'core'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/core/blob/master/doc/index.rst)

## Continuous Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : ce669c3.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR |  |


## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/components/editor/component.js | check if still used |
| src/components/renderer/component.js | check why there is a property dependant on "shown_columns" in here. As it is a List Widget property, it does not seems relevant at all. |
| src/serializers/eventlog.js | check if it's normal that there is no this._super. Are other extractRelationships still working? |
| src/routes/application.js | check if this is still used |
| src/lib/utils/data.js | change parentElement term to something more descriptive |
| src/lib/utils/notification.js | doing it clean |
| src/lib/utils/notification.js | doing it clean |
| src/lib/utils/notification.js | doing it clean |
| src/lib/utils/event.js | delete this, as it looks more like a registry than an util |
| src/lib/utils/dom.js | remove this file and requirements from elsewhere |
| src/lib/utils/widgetSelectors.js | implement Key exist feature |
| src/lib/factories/widget.js | check if this is still needed, as mixins are in configuration now |
| src/lib/abstractclassregistry.js | manage element with add and remove methods |
| src/mixins/inspectableitem.js | refactor the 20 lines below in an utility function "getEditorForAttr" |
| src/mixins/consolemanager.js | move this to development brick |
| src/mixins/embeddedrecordserializer.js | dynamize |
| src/controller/widget.js | manage this with utils.problems |
| src/controller/partialslotable.js | put this in arrayutils |
| src/controller/login.js | delete store in this#destroy |
| src/controller/form.js | refactor this |
| src/forms/modelform/controller.js | search this value into schema |
| src/forms/modelform/controller.js | use the real schema, not the dict used to create it |
| src/view/listline.js | @gwen check if it's possible to remove this class |
| src/view/validationtextfield.js | move this to components dir |
| src/view/mixineditdropdown.js | @gwen check if it's possible to remove this class |
| src/view/formwrapper.js | watch out ! garbage collector might not work here! Possible memory leak. |
| src/view/formwrapper.js | "on" without "off" |
| src/view/validationtextarea.js | move this to components dir |
| src/view/tabledraggableth.js | @gwen check if it's possible to remove this class, or move it to uibase |


### FIXMES

| File   | Note   |
|--------|--------|
| src/components/editor/component.js | auto-detect if we need standalone mode or not, stop using a variable, for a better comprehension |
| src/routes/userview.js | don't use jquery in here, it's for views ! |
| src/controller/recordinfopopup.js | do not use jquery for that kind of things on a controller |
| src/controller/userview.js | wrapper does not seems to have a widget |
| src/forms/widgetform/controller.js | this works when "xtype" is "widget" |


## Additional info

Minified version : 8 files (size: 256K)
Development version : 115 files (size: 704K)
