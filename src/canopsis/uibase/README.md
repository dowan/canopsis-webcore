# Uibase Canopsis Brick

## Description

Base UI application layer for Canopsis frontend

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/uibase.git
    $ cp -r uibase $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable uibase

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'uibase'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/uibase/blob/master/doc/index.rst)

## Continuous Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : a2ad630.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR |  |


## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/components/classifieditemselector/component.js | fuzzy search |
| src/components/classifieditemselector/component.js | hover effect |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/colpick/component.js | check to destroy colpick |
| src/components/elementidselectorwithoptions/component.js | put this on a dedicated util |
| src/components/elementidselectorwithoptions/component.js | manage default values |
| src/components/elementidselectorwithoptions/component.js | stop using polymorphicTypeKey, use sourceMappingKeys instead |
| src/components/linklist/component.js | use the container defined in the initializer |
| src/components/filefield/component.js | check if all the component property are still used, and refactor if needed |
| src/components/actionfilter/component.js | not used yet |
| src/widgets/list/controller.js | check if useless or not |
| src/editors/editor-elementidselectorwithoptions.hbs | manage search in a dynamic way, as an editor property binding to a search method |
| src/editors/editor-elementidselectorwithoptions.hbs | make this doc viewable on the generated doc |
| src/mixins/responsivelist.js | check if still used |
| src/mixins/arraysearch.js | these checks should be asserts |


### FIXMES

| File   | Note   |
|--------|--------|
| src/components/linklist/component.js | on "src/templates/actionbutton-info.hbs", the component is used with the "linkInfoPattern" property. This property does not seems relevant anymore. |
| src/components/classifiedcrecordselector/component.js | is store destroyed? |
| src/components/dateinterval/component.js | destroy the Jquery plugin at willDestroyElement, and check for possible undestroyed event bindings |
| src/widgets/uimaintabcollection/controller.js |: the factory "widgetbase" is a hack to make the canopsis rights reopen work. But it make the view "app_header" not working without the canopsis-rights brick |
| src/mixins/responsivelist.js | undefined |
| src/mixins/periodicrefresh.js | periodicrefresh deactivated in testing mode because it throws global failures |


## Additional info

Minified version : 183 files (size: 1,2M)
Development version : 268 files (size: 1,6M)
