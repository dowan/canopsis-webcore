# Canopsis-ui Canopsis Brick

## Description

Provides objects and templates that are not technically required by the UI, but that are always provided with Canopsis to provide some functionnal aspects of a Canopsis application

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui.git
    $ cp -r canopsis-ui $CANOPSIS_PATH/var/www/canopsis

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable canopsis-ui

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'canopsis-ui'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui/blob/master/doc/index.rst)

## Continuous Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : b0104b6.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/components/codeeditor/component.js<br>  36:30  error  "CodeMirror" is not defined         no-undef<br>  42:27  error  Strings must use singlequote        quotes<br>  42:50  error  "change" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/forms/jobform/controller.js<br>   49:42  error  Strings must use singlequote              quotes<br>  117:25  error  "recordWizard" is defined but never used  no-unused-vars<br>  129:27  error  Strings must use singlequote              quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/forms/scheduleform/controller.js<br>  41:27  error  Strings must use singlequote  quotes<br>  41:50  error  Strings must use singlequote  quotes<br>  41:71  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/forms/taskform/controller.js<br>  47:42  error  Strings must use singlequote  quotes<br>  51:52  error  Strings must use singlequote  quotes<br>  51:71  error  Strings must use singlequote  quotes<br>  53:52  error  Strings must use singlequote  quotes<br>  53:73  error  Strings must use singlequote  quotes<br>  99:27  error  Strings must use singlequote  quotes<br>  99:48  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/reopens/routes/application.js<br>  27:13  error  "set" is defined but never used  no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/canopsis-ui/src/reopens/views/application.js<br>   23:37  error  "application" is defined but never used                   no-unused-vars<br>   26:13  error  "get" is defined but never used                           no-unused-vars<br>   27:13  error  "set" is defined but never used                           no-unused-vars<br>   34:19  error  Strings must use singlequote                              quotes<br>   40:53  error  Strings must use singlequote                              quotes<br>   41:27  error  Strings must use singlequote                              quotes<br>   41:54  error  Strings must use singlequote                              quotes<br>   42:57  error  Strings must use singlequote                              quotes<br>   45:53  error  Strings must use singlequote                              quotes<br>   46:27  error  Strings must use singlequote                              quotes<br>   46:54  error  Strings must use singlequote                              quotes<br>   57:19  error  Strings must use singlequote                              quotes<br>   59:47  error  Strings must use singlequote                              quotes<br>   61:39  error  Strings must use singlequote                              quotes<br>   62:39  error  Strings must use singlequote                              quotes<br>   63:38  error  Strings must use singlequote                              quotes<br>   66:41  error  Strings must use singlequote                              quotes<br>   90:34  error  Strings must use singlequote                              quotes<br>   91:36  error  Strings must use singlequote                              quotes<br>   91:63  error  Strings must use singlequote                              quotes<br>   92:42  error  Strings must use singlequote                              quotes<br>   98:19  error  Strings must use singlequote                              quotes<br>  100:47  error  Strings must use singlequote                              quotes<br>  105:19  error  Strings must use singlequote                              quotes<br>  117:57  error  Strings must use singlequote                              quotes<br>  118:23  error  Strings must use singlequote                              quotes<br>  118:39  error  Strings must use singlequote                              quotes<br>  118:62  error  Strings must use singlequote                              quotes<br>  119:37  error  Strings must use singlequote                              quotes<br>  123:27  error  Strings must use singlequote                              quotes<br>  123:57  error  Strings must use singlequote                              quotes<br>  123:81  error  Strings must use singlequote                              quotes<br>  126:27  error  Strings must use singlequote                              quotes<br>  126:57  error  Strings must use singlequote                              quotes<br>  126:80  error  Strings must use singlequote                              quotes<br>  128:22  error  Expected indentation of 20 space characters but found 21  indent<br>  128:24  error  Strings must use singlequote                              quotes<br>  128:43  error  Strings must use singlequote                              quotes<br>  128:66  error  Strings must use singlequote                              quotes<br>  133:19  error  Strings must use singlequote                              quotes<br>  135:21  error  "fix_sidebar" is not defined                              no-undef<br>  139:17  error  "fix_sidebar" is not defined                              no-undef<br><br>✖ 59 problems (59 errors, 0 warnings)<br><br> |


## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/reopens/views/application.js | uncomment while ready |
| src/components/rruleeditor/component.js | move this in utils, somewhere ... |


### FIXMES



## Additional info

Minified version : 12 files (size: 96K)
Development version : 18 files (size: 172K)
