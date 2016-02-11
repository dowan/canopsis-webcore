# Charts Canopsis Brick

## Description

Charts widgets for canopsis

## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ git clone https://git.canopsis.net/canopsis-ui-bricks/charts.git
    $ cp -r charts $CANOPSIS_PATH/var/www/canopsis

Then, you need to import specific schemas

    $ su - canopsis
    $ cp $CANOPSIS_PATH/var/www/canopsis/charts/schemas/* $CANOPSIS_PATH/etc/schema.d
    $ schema2db

Then, you need to enable the brick

    $ su - canopsis
    $ webmodulemanager enable charts

You can see enabled bricks

    $ su - canopsis
    $ webmodulemanager list
    [u'core', u'uibase', u'monitoring', ..., **u'charts'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/charts/blob/master/doc/index.rst)

## Continuous Integration

Tested on commit : [ERROR : The brick is not in a dedicated git repository].

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/c3categorychart/component.js<br>   21:10  error  Strings must use singlequote                              quotes<br>   25:5   error  Expected indentation of 8 space characters but found 4    indent<br>   26:5   error  Expected indentation of 8 space characters but found 4    indent<br>   29:5   error  Expected indentation of 8 space characters but found 4    indent<br>   34:5   error  Expected indentation of 8 space characters but found 4    indent<br>   40:56  error  Unexpected trailing comma                                 comma-dangle<br>  140:32  error  "Handlebars" is not defined                               no-undef<br>  189:42  error  Unexpected trailing comma                                 comma-dangle<br>  228:17  error  "colors" is defined but never used                        no-unused-vars<br>  239:17  error  "isBarChart" is defined but never used                    no-unused-vars<br>  245:41  error  "ratio" is defined but never used                         no-unused-vars<br>  289:53  error  "j" is defined but never used                             no-unused-vars<br>  305:19  error  Expected indentation of 20 space characters but found 18  indent<br>  306:19  error  Expected indentation of 20 space characters but found 18  indent<br>  307:21  error  Expected indentation of 22 space characters but found 20  indent<br>  309:19  error  Expected indentation of 20 space characters but found 18  indent<br>  310:21  error  Expected indentation of 22 space characters but found 20  indent<br>  315:21  error  Expected indentation of 22 space characters but found 20  indent<br>  317:18  error  Unexpected trailing comma                                 comma-dangle<br>  326:25  error  "c3" is not defined                                       no-undef<br>  372:5   error  Expected indentation of 8 space characters but found 4    indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/c3js/component.js<br>  41:25  error  "c3" is not defined  no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/flotchart/component.js<br>  122:21  error  Expected indentation of 24 space characters but found 20  indent<br>  123:21  error  Expected indentation of 24 space characters but found 20  indent<br>  124:17  error  Expected indentation of 20 space characters but found 16  indent<br>  175:25  error  "key" is already defined                                  no-redeclare<br>  176:25  error  "idx" is already defined                                  no-redeclare<br>  219:37  error  Expected indentation of 32 space characters but found 36  indent<br>  220:37  error  Expected indentation of 32 space characters but found 36  indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/metricitemeditor/component.js<br>  34:27  error  Strings must use singlequote  quotes<br>  35:42  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/metricselector2/component.js<br>  121:36  error  Strings must use singlequote  quotes<br>  122:36  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/selectedmetricheader/component.js<br>  25:13  error  "set" is defined but never used     no-unused-vars<br>  26:13  error  "isNone" is defined but never used  no-unused-vars<br>  27:13  error  "__" is defined but never used      no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/components/serieitemeditor/component.js<br>  35:27  error  Strings must use singlequote  quotes<br>  36:42  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/widgets/categorychart/controller.js<br>  57:37  error  Unexpected trailing comma  comma-dangle<br><br>/home/gwen/programmation/canopsis/sources/webcore/var/www/canopsis/charts/src/widgets/timegraph/controller.js<br>   71:70  error  "config" is defined but never used  no-unused-vars<br>  176:21  error  "config" is defined but never used  no-unused-vars<br>  269:29  error  Strings must use singlequote        quotes<br>  269:56  error  Strings must use singlequote        quotes<br>  269:81  error  Strings must use singlequote        quotes<br>  270:27  error  Strings must use singlequote        quotes<br>  275:27  error  Strings must use singlequote        quotes<br>  342:21  error  "me" is defined but never used      no-unused-vars<br>  452:44  error  Unexpected trailing comma           comma-dangle<br><br>✖ 48 problems (48 errors, 0 warnings)<br><br> |

## Code Notes

### TODOS



### FIXMES



## Additional info

Minified version : 17 files (size: 128K)
Development version : 25 files (size: 216K)
