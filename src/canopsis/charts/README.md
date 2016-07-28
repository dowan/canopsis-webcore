# Charts Canopsis Brick

## Index

- [Description](#description)
- [Content](#content)
- [Installation](#installation)
- [Usage](#usage)
- [Continuous-integration](#continuous-integration)
- [Code-notes](#code-notes)
- [Additional-info](#additional-info)

## Description

Charts widgets for canopsis

## Content



## Screenshots



## Installation

You need to clone the git repository and copy directory to Canopsis path

    $ su - canopsis 
    $ cd var/www
    $ ./bin/brickmanager install charts

Then, you need to enable the brick

    $ ./bin/brickmanager enable charts

You can see enabled bricks

    $ su - canopsis
    $ cd var/www
    $ ./bin/brickmanager list
    [u'core', u'uibase', u'monitoring', ..., **u'charts'**]

## Usage

See [Howto](https://git.canopsis.net/canopsis-ui-bricks/charts/blob/master/doc/index.rst)

## Continuous-Integration

### Tests

The last build was not a full build. Please use the "full-compile" npm script to make test results show up here.

### Lint

Tested on commit : 5277306.

| Target | Status | Log |
| ------ | ------ | --- |
| Lint   | :negative_squared_cross_mark: ERROR | <br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/c3categorychart/component.js<br>   21:10  error  Strings must use singlequote                              quotes<br>   25:5   error  Expected indentation of 8 space characters but found 4    indent<br>   26:5   error  Expected indentation of 8 space characters but found 4    indent<br>   29:5   error  Expected indentation of 8 space characters but found 4    indent<br>   75:5   error  Expected indentation of 8 space characters but found 4    indent<br>   84:56  error  Unexpected trailing comma                                 comma-dangle<br>  195:32  error  "Handlebars" is not defined                               no-undef<br>  247:42  error  Unexpected trailing comma                                 comma-dangle<br>  287:17  error  "colors" is defined but never used                        no-unused-vars<br>  298:17  error  "isBarChart" is defined but never used                    no-unused-vars<br>  304:41  error  "ratio" is defined but never used                         no-unused-vars<br>  348:53  error  "j" is defined but never used                             no-unused-vars<br>  364:19  error  Expected indentation of 20 space characters but found 18  indent<br>  365:19  error  Expected indentation of 20 space characters but found 18  indent<br>  366:21  error  Expected indentation of 22 space characters but found 20  indent<br>  368:19  error  Expected indentation of 20 space characters but found 18  indent<br>  369:21  error  Expected indentation of 22 space characters but found 20  indent<br>  374:21  error  Expected indentation of 22 space characters but found 20  indent<br>  376:18  error  Unexpected trailing comma                                 comma-dangle<br>  385:25  error  "c3" is not defined                                       no-undef<br>  436:5   error  Expected indentation of 8 space characters but found 4    indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/c3js/component.js<br>  53:25  error  "c3" is not defined  no-undef<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/flotchart/component.js<br>  122:21  error  Expected indentation of 24 space characters but found 20  indent<br>  123:21  error  Expected indentation of 24 space characters but found 20  indent<br>  124:17  error  Expected indentation of 20 space characters but found 16  indent<br>  175:25  error  "key" is already defined                                  no-redeclare<br>  176:25  error  "idx" is already defined                                  no-redeclare<br>  219:37  error  Expected indentation of 32 space characters but found 36  indent<br>  220:37  error  Expected indentation of 32 space characters but found 36  indent<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/metricitemeditor/component.js<br>  34:27  error  Strings must use singlequote  quotes<br>  35:42  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/metricselector2/component.js<br>  121:36  error  Strings must use singlequote  quotes<br>  122:36  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/selectedmetricheader/component.js<br>  25:13  error  "set" is defined but never used     no-unused-vars<br>  26:13  error  "isNone" is defined but never used  no-unused-vars<br>  27:13  error  "__" is defined but never used      no-unused-vars<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/components/serieitemeditor/component.js<br>  35:27  error  Strings must use singlequote  quotes<br>  36:42  error  Strings must use singlequote  quotes<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/widgets/categorychart/controller.js<br>  57:37  error  Unexpected trailing comma  comma-dangle<br><br>/home/gwen/programmation/canopsis/sources/webcore/src/canopsis/charts/src/widgets/timegraph/controller.js<br>   71:70  error  "config" is defined but never used    no-unused-vars<br>  100:21  error  "template" is defined but never used  no-unused-vars<br>  184:21  error  "config" is defined but never used    no-unused-vars<br>  282:29  error  Strings must use singlequote          quotes<br>  282:56  error  Strings must use singlequote          quotes<br>  282:81  error  Strings must use singlequote          quotes<br>  283:27  error  Strings must use singlequote          quotes<br>  288:27  error  Strings must use singlequote          quotes<br>  475:38  error  Strings must use singlequote          quotes<br>  476:36  error  Strings must use singlequote          quotes<br>  480:33  error  "Handlebars" is not defined           no-undef<br>  500:44  error  Unexpected trailing comma             comma-dangle<br>  780:17  error  Variables should not be deleted       no-delete-var<br><br>✖ 52 problems (52 errors, 0 warnings)<br><br> |


## Code-Notes

### TODOS



### FIXMES



## Additional-info

Minified version : 4 files (size: 92K)
Development version : 25 files (size: 224K)
