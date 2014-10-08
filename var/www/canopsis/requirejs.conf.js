require.config({
    waitSeconds: 20,
    baseUrl: '/static/',
    paths: {
        'app': 'canopsis/core',
        'runtime.conf': 'canopsis/runtime.conf',
        'schemas': 'canopsis/schemas',
        'etc': 'canopsis/etc',
        'lib': 'webcore-libs/dev',
        'text': 'webcore-libs/dev/text',
        'jquery': 'webcore-libs/dev/jquery-1.10.2',
        'plugins': 'webcore-libs/plugins/plugin',
        'consolejs': 'webcore-libs/console.js/console',
        'ember-cloaking': 'canopsis/core/lib/wrappers/ember-cloaking',
        'codemirror': 'webcore-libs/codemirror/codemirror',
        'colorpicker': 'webcore-libs/colorpicker/js/spectrum',
        'colorselector': 'webcore-libs/colorselector/js/bootstrap-colorselector',
        'seeds': 'webcore-libs/seeds',
        'jquery.encoding.digests.sha1': 'webcore-libs/jQuery.encoding.digests.sha1',
        'jquery.md5': 'webcore-libs/jquery.md5',
        'handlebars': 'webcore-libs/dev/handlebars-v1.3.0',
        'ember': 'canopsis/core/lib/wrappers/ember',
        'mmenu': 'canopsis/core/lib/wrappers/mmenu',
        'jsonselect': 'canopsis/core/lib/wrappers/jsonselect',
        'gridster': 'webcore-libs/dev/gridster/jquery.gridster',
        'timepicker': 'webcore-libs/dev/timepicker/bootstrap-datetimepicker.min',
        'moment': 'webcore-libs/dev/moment-with-langs.min',
        'ember-data': 'canopsis/core/lib/wrappers/ember-data',
        'ember-listview': 'webcore-libs/dev/ember-list-view',
        'ember-widgets': 'webcore-libs/ember-widgets/js/ember-widgets',
        'bootstrap': 'webcore-libs/bootstrap/current/js/bootstrap.min',
        'daterangepicker': 'webcore-libs/dev/daterangepicker',
        'jqueryui': 'webcore-libs/dev/jquery-ui-1.10.3',
        'bootbox': 'webcore-libs/dev/bootbox',
        'icheck': 'webcore-libs/icheck/icheck',
        'jquerydatatables': 'webcore-libs/dev/jquery.dataTables',
        'bootstrapdatatables': 'webcore-libs/dev/dataTables.bootstrap',
        'colreorder': 'webcore-libs/dev/ColReorder',
        'adminLTElib': 'webcore-libs/dev/AdminLTE',
        'adminLTE': 'canopsis/core/lib/wrappers/adminLTE',
        'utils': 'canopsis/core/lib/loaders/utils',
        'lodash': 'webcore-libs/dev/lodash.compat',
        'css3-mediaqueries': 'webcore-libs/min/css3-mediaqueries',
        'math': 'webcore-libs/dev/math',

        'flotchart': 'webcore-libs/flot/jquery.flot',
        'flotchart-canvas': 'webcore-libs/flot/jquery.flot.canvas',
        'flotchart-categories': 'webcore-libs/flot/jquery.flot.categories',
        'flotchart-crosshair': 'webcore-libs/flot/jquery.flot.crosshair',
        'flotchart-errorbars': 'webcore-libs/flot/jquery.flot.errorbars',
        'flotchart-fillbetween': 'webcore-libs/flot/jquery.flot.fillbetween',
        'flotchart-image': 'webcore-libs/flot/jquery.flot.image',
        'flotchart-navigate': 'webcore-libs/flot/jquery.flot.navigate',
        'flotchart-pie': 'webcore-libs/flot/jquery.flot.pie',
        'flotchart-resize': 'webcore-libs/flot/jquery.flot.resize',
        'flotchart-selection': 'webcore-libs/flot/jquery.flot.selection',
        'flotchart-stack': 'webcore-libs/flot/jquery.flot.stack',
        'flotchart-symbol': 'webcore-libs/flot/jquery.flot.symbol',
        'flotchart-threshold': 'webcore-libs/flot/jquery.flot.threshold',
        'flotchart-time': 'webcore-libs/flot/jquery.flot.time'

    },

    shim: {
        'jquery.encoding.digests.sha1': {
             deps: ['jquery']
        },

        'adminLTE': {
            deps: ['jquery', 'bootstrap']
        },

        'adminLTElib': {
            deps: ['jquery']
        },

        'bootbox': {
            deps: ['jquery', 'bootstrap']
        },

        'jquerydatatables': {
            deps: ['jquery']
        },

        'icheck': {
            deps: ['jquery']
        },

        'bootstrapdatatables': {
            deps: ['jquery', 'jquerydatatables']
        },

        'jqueryui': {
            deps: ['jquery']
        },

        'consolejs': {
            deps: ["ember"]
        },

        'ember': {
            deps: ['jquery', 'handlebars']
        },

        'ember-cloaking': {
            deps: ['ember']
        },

        'ember-data': {
            deps: ['ember']
        },

        'ember-listview': {
            deps: ['ember']
        },

        'ember-widgets': {
            deps: ['ember', 'lodash', 'jqueryui', 'ember-listview']
        },

        'bootstrap': {
            deps: ['jquery']
        },

        'colorpicker': {
            deps: ['jquery']
        },

        'gridster': {
            deps: ['jquery']
        },

        'timepicker': {
            deps: ['jquery']
        },

        'flotchart': {
            deps: ['jquery'],
        },

        'flotchart-canvas': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-categories': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-crosshair': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-errorbars': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-fillbetween': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-image': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-navigate': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-pie': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-resize': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-selection': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-stack': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-symbol': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-threshold': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-time': {
            deps: ['jquery', 'flotchart']
        }
    }
});

define([
    'canopsis/file_loader',
    'seeds/RoutesLoader',
    'app/lib/wrappers/console',
    'app/lib/wrappers/extend',
    'app/lib/helpers/i18n'
], function () {
    require(['canopsis/main']);
});
