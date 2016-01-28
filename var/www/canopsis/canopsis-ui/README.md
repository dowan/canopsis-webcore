# Canopsis-ui Canopsis Brick

## Description

Provides objects and templates that are not technically required by the UI, but that are always provided with Canopsis to provide some functionnal aspects of a Canopsis application

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/canopsis-ui.git
    $ cp -r canopsis-ui $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/canopsis-ui/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

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

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-ui/src/forms/jobform/controller.js<br>   49:42  error  Strings must use singlequote              quotes<br>  107:25  error  "recordWizard" is defined but never used  no-unused-vars<br>  119:27  error  Strings must use singlequote              quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-ui/src/forms/scheduleform/controller.js<br>  41:27  error  Strings must use singlequote  quotes<br>  41:50  error  Strings must use singlequote  quotes<br>  41:71  error  Strings must use singlequote  quotes<br>  42:14  error  Unexpected trailing comma     comma-dangle<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-ui/src/forms/taskform/controller.js<br>  47:42  error  Strings must use singlequote  quotes<br>  51:52  error  Strings must use singlequote  quotes<br>  51:71  error  Strings must use singlequote  quotes<br>  53:52  error  Strings must use singlequote  quotes<br>  53:73  error  Strings must use singlequote  quotes<br>  99:27  error  Strings must use singlequote  quotes<br>  99:48  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/canopsis-ui/src/reopens/views/application.js<br>   23:37  error  "application" is defined but never used                   no-unused-vars<br>   26:13  error  "get" is defined but never used                           no-unused-vars<br>   27:13  error  "set" is defined but never used                           no-unused-vars<br>   37:19  error  Strings must use singlequote                              quotes<br>   43:53  error  Strings must use singlequote                              quotes<br>   44:27  error  Strings must use singlequote                              quotes<br>   44:54  error  Strings must use singlequote                              quotes<br>   45:57  error  Strings must use singlequote                              quotes<br>   48:53  error  Strings must use singlequote                              quotes<br>   49:27  error  Strings must use singlequote                              quotes<br>   49:54  error  Strings must use singlequote                              quotes<br>   60:19  error  Strings must use singlequote                              quotes<br>   62:47  error  Strings must use singlequote                              quotes<br>   64:39  error  Strings must use singlequote                              quotes<br>   65:39  error  Strings must use singlequote                              quotes<br>   66:38  error  Strings must use singlequote                              quotes<br>   69:41  error  Strings must use singlequote                              quotes<br>   93:34  error  Strings must use singlequote                              quotes<br>   94:36  error  Strings must use singlequote                              quotes<br>   94:63  error  Strings must use singlequote                              quotes<br>   95:42  error  Strings must use singlequote                              quotes<br>  101:19  error  Strings must use singlequote                              quotes<br>  103:47  error  Strings must use singlequote                              quotes<br>  108:19  error  Strings must use singlequote                              quotes<br>  120:57  error  Strings must use singlequote                              quotes<br>  121:23  error  Strings must use singlequote                              quotes<br>  121:39  error  Strings must use singlequote                              quotes<br>  121:62  error  Strings must use singlequote                              quotes<br>  122:37  error  Strings must use singlequote                              quotes<br>  126:27  error  Strings must use singlequote                              quotes<br>  126:57  error  Strings must use singlequote                              quotes<br>  126:81  error  Strings must use singlequote                              quotes<br>  129:27  error  Strings must use singlequote                              quotes<br>  129:57  error  Strings must use singlequote                              quotes<br>  129:80  error  Strings must use singlequote                              quotes<br>  131:22  error  Expected indentation of 20 space characters but found 21  indent<br>  131:24  error  Strings must use singlequote                              quotes<br>  131:43  error  Strings must use singlequote                              quotes<br>  131:66  error  Strings must use singlequote                              quotes<br>  136:19  error  Strings must use singlequote                              quotes<br>  138:21  error  "fix_sidebar" is not defined                              no-undef<br>  142:17  error  "fix_sidebar" is not defined                              no-undef<br><br>✖ 56 problems (56 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS

| File   | Note   |
|--------|--------|
| src/reopens/views/application.js | uncomment while ready |


### FIXMES


