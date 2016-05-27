# Uibase Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Base UI application layer for Canopsis frontend

## Content

### components

 - actionbutton
 - actionfilter
 - arrayclassifiedcrecordselector
 - arrayeditor
 - classifiedcrecordselector
 - classifieditemselector
 - colorchooser
 - colpick
 - contextselector
 - dateinterval
 - dictclassifiedcrecordselector
 - dropdownbutton
 - dropdownbuttoncontent
 - Dropdownbuttonheader
 - Dropdownbuttonoverview
 - Dropdownbuttontitle
 - elementidselectorwithoptions
 - eventkey
 - filefield
 - filterclause
 - formulaeditor
 - ical
 - labelledlink
 - linklist
 - mixinselector
 - modelselect
 - password
 - propertiestopopup
 - restobjectcombo
 - searchbar
 - simpledicteditor
 - slider
 - stringclassifiedcrecordselector
 - tabscontent
 - tabheader
 - table
 - tabs
 - tabscontentgroup
 - tabsheadergroup
 - textwithsortoption
 - timestamptooltiped
 - typedvalue

### functions

 - HumanReadableHelper
 - getEntitiesFromServer
 - _addGraph
 - findItems
 - deleteRecords
 - select
 - unselect
 - saveRecords
 - newRecord
 - editRecord
 - updateModel
 - weaveLinks
 - refreshSelectedShapes
 - refreshLockedShapes
 - showToolBox
 - destroyToolBox
 - removeTmpLink
 - lock
 - addNodes
 - delNodes
 - updateNodes
 - addLinks
 - delLinks
 - updateLinks
 - checkTargetLink
 - getNode
 - addLink
 - newToolBoxItem
 - getToolBoxItems

### properties

 - invisibleCellsCount
 - actions

### widgets

 - List
 - TextWidget
 - Uimaintabcollection

### editors

 - editor-actionfilter
 - editor-array
 - editor-arrayclassifiedcrecordselector
 - editor-boolean
 - editor-color
 - editor-contextselector
 - editor-dateinterval
 - editor-defaultpropertyeditor
 - editor-dictclassifiedcrecordselector
 - editor-duration
 - editor-durationWithUnits
 - editor-error
 - editor-eventkey
 - editor-integer
 - editor-json
 - editor-labelandviewid
 - editor-labelledlink
 - editor-mail
 - editor-mixins
 - editor-modelselect
 - editor-password
 - editor-passwordmd5
 - editor-passwordsha1
 - editor-restobject
 - editor-richtext
 - editor-separator
 - editor-serieformula
 - editor-simpledict
 - editor-simplelist
 - editor-slider
 - editor-sortable
 - editor-source
 - editor-state
 - editor-stringclassifiedcrecordselector
 - editor-stringpair
 - editor-tags
 - editor-textarea
 - editor-timestamp
 - editor-typedvalue
 - editor-userpreference

### renderers

 - renderer-actionfilter
 - renderer-boolean
 - renderer-color
 - renderer-conf
 - renderer-labelledlink
 - renderer-mail
 - renderer-object
 - renderer-percent
 - renderer-recordinfopopup
 - renderer-richtext
 - renderer-source
 - renderer-subprocess
 - renderer-tags
 - renderer-timestamp
 - renderer-translator

### schemas

 - schema-arraysearch
 - schema-background
 - schema-canvas
 - schema-crud
 - schema-customfilter
 - schema-customfilterlist
 - schema-draggablecolumns
 - schema-euewi
 - schema-gridlayout
 - schema-horizontallayout
 - schema-jobmanager
 - schema-list
 - schema-listlinedetail
 - schema-pagination
 - schema-periodicrefresh
 - schema-rangecolor
 - schema-responsivelist
 - schema-sortablearray
 - schema-text
 - schema-topology
 - schema-uimaintabcollection
 - schema-widgetcontainer



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install uibase

Then, you need to enable the brick

    $ ./bin/brickmanager enable uibase

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'uibase'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/uibase/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 63ebce9.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/uibase/src/components/contextselector/component.js<br>  172:17  error  Expected indentation of 20 space characters but found 16  indent<br>  173:21  error  Expected indentation of 24 space characters but found 20  indent<br>  174:17  error  Expected indentation of 20 space characters but found 16  indent<br>  175:21  error  Expected indentation of 24 space characters but found 20  indent<br>  176:17  error  Expected indentation of 20 space characters but found 16  indent<br>  177:21  error  Expected indentation of 24 space characters but found 20  indent<br>  187:17  error  Expected indentation of 20 space characters but found 16  indent<br>  188:21  error  Expected indentation of 24 space characters but found 20  indent<br>  199:17  error  Expected indentation of 20 space characters but found 16  indent<br>  200:21  error  Expected indentation of 24 space characters but found 20  indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/uibase/src/components/typedvalue/component.js<br>  92:17  error  Expected indentation of 20 space characters but found 16  indent<br>  93:17  error  Expected indentation of 20 space characters but found 16  indent<br><br>✖ 12 problems (12 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/editors/editor-elementidselectorwithoptions.hbs | manage search in a dynamic way, as an editor property binding to a search method |
| src/editors/editor-elementidselectorwithoptions.hbs | make this doc viewable on the generated doc |
| src/mixins/responsivelist.js | check if still used |
| src/mixins/arraysearch.js | these checks should be asserts |
| src/widgets/list/controller.js | check if useless or not |
| src/components/elementidselectorwithoptions/component.js | put this on a dedicated util |
| src/components/elementidselectorwithoptions/component.js | manage default values |
| src/components/elementidselectorwithoptions/component.js | stop using polymorphicTypeKey, use sourceMappingKeys instead |
| src/components/actionfilter/component.js | not used yet |
| src/components/classifieditemselector/component.js | fuzzy search |
| src/components/classifieditemselector/component.js | hover effect |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/classifieditemselector/component.js | use searchmethodsregistry instead of plain old static code |
| src/components/linklist/component.js | use the container defined in the initializer |
| src/components/filefield/component.js | check if all the component property are still used, and refactor if needed |
| src/components/colpick/component.js | check to destroy colpick |


### FIXMES

| File   | Note   |
|--------|--------|
| src/mixins/responsivelist.js | undefined |
| src/mixins/periodicrefresh.js | periodicrefresh deactivated in testing mode because it throws global failures |
| src/widgets/uimaintabcollection/controller.js |: the factory "widgetbase" is a hack to make the canopsis rights reopen work. But it make the view "app_header" not working without the canopsis-rights brick |
| src/components/dateinterval/component.js | destroy the Jquery plugin at willDestroyElement, and check for possible undestroyed event bindings |
| src/components/linklist/component.js | on "src/templates/actionbutton-info.hbs", the component is used with the "linkInfoPattern" property. This property does not seems relevant anymore. |
| src/components/classifiedcrecordselector/component.js | is store destroyed? |


## Additional-info

Minified version : 183 files (size: 1008K)
Development version : 268 files (size: 1,6M)
