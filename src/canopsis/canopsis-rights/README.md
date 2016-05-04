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

### components

 - right-checksum
 - right-action
 - rightselector

### functions

 - updateRecord
 - deleteRecord
 - beforeModel
 - beforeModel
 - beforeModel
 - afterModel

### events

 - toggleEditMode
Handle rights management when toggling edit mode.



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

Tested on commit : 3ca8f05.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/components/right-checksum/component.js<br>  21:10  error  Strings must use singlequote    quotes<br>  29:13  error  "__" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/components/rights-action/component.js<br>  27:13  error  "set" is defined but never used     no-unused-vars<br>  28:13  error  "isNone" is defined but never used  no-unused-vars<br>  29:13  error  "__" is defined but never used      no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/components/rightsselector/component.js<br>   24:13  error  "rightsRegistry" is defined but never used   no-unused-vars<br>   78:29  error  Strings must use singlequote                 quotes<br>  102:21  error  "possibleClassSplit" is not defined          no-undef<br>  102:61  error  Strings must use singlequote                 quotes<br>  103:24  error  "possibleClassSplit" is not defined          no-undef<br>  104:41  error  "possibleClassSplit" is not defined          no-undef<br>  188:48  error  "additionnalData" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/forms/viewrightsform/controller.js<br>   37:24  error  "__" is not defined           no-undef<br>   40:24  error  "__" is not defined           no-undef<br>   64:45  error  Unexpected trailing comma     comma-dangle<br>  108:80  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/objects/rightsregistry.js<br>  24:9   error  "AbstractClassRegistry" is not defined  no-undef<br>  33:30  error  "AbstractClassRegistry" is not defined  no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/adapters/userview.js<br>  23:37  error  "application" is defined but never used                   no-unused-vars<br>  49:17  error  "rightsRegistry" is not defined                           no-undef<br>  51:17  error  "formattedViewId" is not defined                          no-undef<br>  53:27  error  "rightsRegistry" is not defined                           no-undef<br>  53:52  error  "formattedViewId" is not defined                          no-undef<br>  57:27  error  Expected indentation of 24 space characters but found 26  indent<br>  58:27  error  Expected indentation of 24 space characters but found 26  indent<br>  59:27  error  Expected indentation of 24 space characters but found 26  indent<br>  60:27  error  Expected indentation of 24 space characters but found 26  indent<br>  60:32  error  "formattedViewId" is not defined                          no-undef<br>  61:27  error  Expected indentation of 24 space characters but found 26  indent<br>  61:31  error  "formattedViewId" is not defined                          no-undef<br>  62:27  error  Expected indentation of 24 space characters but found 26  indent<br>  62:41  error  "formattedViewId" is not defined                          no-undef<br>  63:27  error  Expected indentation of 24 space characters but found 26  indent<br>  67:21  error  "rightsRegistry" is not defined                           no-undef<br>  74:33  error  "formattedViewId" is not defined                          no-undef<br>  95:17  error  "rightsRegistry" is not defined                           no-undef<br>  97:17  error  "formattedViewId" is not defined                          no-undef<br>  98:29  error  "rightsRegistry" is not defined                           no-undef<br>  98:54  error  "formattedViewId" is not defined                          no-undef<br>  99:45  error  "formattedViewId" is not defined                          no-undef<br>  99:62  error  "rightsRegistry" is not defined                           no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/mixins/crud.js<br>  23:37  error  "application" is defined but never used  no-unused-vars<br>  29:13  error  "set" is defined but never used          no-unused-vars<br>  30:13  error  "isNone" is defined but never used       no-unused-vars<br>  31:13  error  "__" is defined but never used           no-unused-vars<br>  36:42  error  Strings must use singlequote             quotes<br>  47:42  error  Strings must use singlequote             quotes<br>  58:42  error  Strings must use singlequote             quotes<br>  69:42  error  Strings must use singlequote             quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/mixins/customfilterlist.js<br>  23:37  error  "application" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/mixins/documentation.js<br>  24:37  error  "application" is defined but never used  no-unused-vars<br>  28:13  error  "__" is defined but never used           no-unused-vars<br>  39:66  error  Irregular whitespace not allowed         no-irregular-whitespace<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/mixins/showviewbutton.js<br>  23:37  error  "application" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/routes/application.js<br>  23:37  error  "application" is defined but never used  no-unused-vars<br>  29:13  error  "set" is defined but never used          no-unused-vars<br>  30:13  error  "isNone" is defined but never used       no-unused-vars<br>  48:17  error  "rightsRegistry" is not defined          no-undef<br>  49:21  error  "route" is defined but never used        no-unused-vars<br>  51:68  error  Strings must use singlequote             quotes<br>  57:25  error  "rightsRegistry" is not defined          no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/routes/authenticated.js<br>  24:37  error  "application" is defined but never used  no-unused-vars<br>  43:68  error  Strings must use singlequote             quotes<br>  46:17  error  "loggedaccountAdapter" is not defined    no-undef<br>  66:67  error  Strings must use singlequote             quotes<br>  69:29  error  "viewId" is not defined                  no-undef<br>  70:82  error  "viewId" is not defined                  no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/routes/userview.js<br>  23:37  error  "application" is defined but never used            no-unused-vars<br>  29:13  error  "isNone" is defined but never used                 no-unused-vars<br>  47:21  error  "applicationController" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-rights/src/reopens/widgets/uimaintabcollection.js<br>  26:13  error  "set" is defined but never used              no-unused-vars<br>  27:13  error  "isNone" is defined but never used           no-unused-vars<br>  28:13  error  "__" is defined but never used               no-unused-vars<br>  30:13  error  "widgetsRegistry" is defined but never used  no-unused-vars<br>  51:53  error  Strings must use singlequote                 quotes<br>  65:53  error  Strings must use singlequote                 quotes<br>  82:53  error  Strings must use singlequote                 quotes<br><br>✖ 77 problems (77 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/reopens/adapters/userview.js | Add the correct right to the current user, to allow him to display the view |
| src/reopens/adapters/userview.js | the right already exists, it's an update |
| src/reopens/adapters/userview.js | replace the userview name if it has changed |
| src/reopens/adapters/userview.js | delete user right in payload |
| src/components/right-checksum/component.js | not used anymore? check and delete this property if possible |


### FIXMES

| File   | Note   |
|--------|--------|
| src/reopens/routes/authenticated.js | use store#adapterFor |
| src/components/rights-action/component.js | don't use _data, it might lead to unpredictable behaviours! |
| src/components/right-checksum/component.js | don't use "_data"! |


## Additional-info

Minified version : 14 files (size: 92K)
Development version : 28 files (size: 208K)
