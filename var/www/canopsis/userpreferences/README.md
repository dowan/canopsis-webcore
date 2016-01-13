# Userpreferences Canopsis Brick

## Description

User preferences brick for canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/userpreferences.git
    $ cp -r userpreferences $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/userpreferences/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db update

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable userpreferences

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'userpreferences'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/userpreferences/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/userpreferences/src/components/userpreferencesmanager/component.js<br>   21:10  error  Strings must use singlequote                              quotes<br>   56:47  error  Unexpected trailing comma                                 comma-dangle<br>  106:43  error  "data" is defined but never used                          no-unused-vars<br>  109:25  error  Expected indentation of 28 space characters but found 24  indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/userpreferences/src/mixins/userconfiguration.js<br>   36:41  error  "options" is defined but never used                       no-unused-vars<br>   65:49  error  Strings must use singlequote                              quotes<br>   66:50  error  Strings must use singlequote                              quotes<br>   86:34  error  "data" is defined but never used                          no-unused-vars<br>  111:65  error  Strings must use singlequote                              quotes<br>  148:14  error  Expected indentation of 12 space characters but found 13  indent<br>  149:17  error  Expected indentation of 17 space characters but found 16  indent<br>  151:17  error  Expected indentation of 17 space characters but found 16  indent<br>  153:17  error  Expected indentation of 17 space characters but found 16  indent<br>  155:17  error  Expected indentation of 17 space characters but found 16  indent<br>  179:54  error  Strings must use singlequote                              quotes<br>  193:13  error  Expected indentation of 13 space characters but found 12  indent<br><br>✖ 16 problems (16 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES


