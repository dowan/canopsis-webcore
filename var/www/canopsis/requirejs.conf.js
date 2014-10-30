require.config({
    waitSeconds: 40,
    baseUrl: '/static/',
    paths: {
        'app': 'canopsis/core',
        'runtime.conf': 'canopsis/runtime.conf',
        'schemas': 'canopsis/schemas',
        'etc': 'canopsis/etc',
        'lib': 'webcore-libs/dev',
        'text': 'webcore-libs/requirejs-text/text',
        'link': 'webcore-libs/requirejs-link/link',
        'jquery': 'canopsis/core/lib/wrappers/jquery',
        'plugins': 'webcore-libs/plugins/plugin',
        'consolejs': 'webcore-libs/console.js/console',
        'ember-cloaking': 'canopsis/core/lib/wrappers/ember-cloaking',
        'codemirror': 'webcore-libs/codemirror/lib/codemirror',
        'seeds': 'webcore-libs/seeds',
        'jquery.encoding.digests.sha1': 'webcore-libs/jQuery.encoding.digests.sha1',
        'jquery.md5': 'webcore-libs/jquery.md5',
        'handlebars': 'webcore-libs/handlebars/handlebars',
        'ember': 'canopsis/core/lib/wrappers/ember',
        'jsonselect': 'canopsis/core/lib/wrappers/jsonselect',
        'timepicker': 'webcore-libs/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
        'moment': 'webcore-libs/moment/min/moment-with-locales.min',
        'ember-data': 'canopsis/core/lib/wrappers/ember-data',
        'ember-listview': 'webcore-libs/ember-list-view/list-view',
        'ember-widgets': 'webcore-libs/ember-widgets/js/ember-widgets', //TODO nuke this
        'bootstrap': 'webcore-libs/bootstrap/dist/js/bootstrap.min',
        'daterangepicker': 'webcore-libs/bootstrap-daterangepicker/daterangepicker',
        'jqueryui': 'webcore-libs/jquery-ui/jquery-ui.min',
        'icheck': 'webcore-libs/iCheck/icheck',
        'adminLTElib': 'webcore-libs/dev/AdminLTE', //TODO make a bower package for this
        'adminLTE': 'canopsis/core/lib/wrappers/adminLTE',
        'utils': 'canopsis/core/lib/loaders/utils',
        'lodash': 'webcore-libs/lodash/dist/lodash.compat',
        'css3-mediaqueries': 'webcore-libs/min/css3-mediaqueries',
        'math': 'webcore-libs/mathjs/dist/math',
        'dragtable': 'webcore-libs/dev/dragtable',
        'ember-jsoneditor-lib': 'webcore-libs/ember-jsoneditor/build/lib',

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
        'flotchart-time': 'webcore-libs/flot/jquery.flot.time',
        'flotchart-valuelabel': 'webcore-libs/flot-plugins/custom/jquery.flot.valuelabel',
        'flotchart-tooltip': 'webcore-libs/flot-plugins/custom/jquery.flot.tooltip'

        'jsplumb': 'webcore-libs/jsplumb/dist/js/jquery.jsPlumb-1.6.4',
        'd3': 'webcore-libs/d3/d3',
        'cy': 'webcore-libs/cytoscape/dist/cytoscape'
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

        'contextmenu': {
            deps: ['jquery']
        },

        'icheck': {
            deps: ['jquery']
        },

        'jqueryui': {
            deps: ['jquery']
        },

        'consolejs': {
            deps: ['ember']
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
        },

        'flotchart-valuelabel': {
            deps: ['jquery', 'flotchart']
        },

        'flotchart-tooltip': {
            deps: ['jquery', 'flotchart']
        },

        'jsplumb': {
            deps: ['jquery']
        }
    }
});


window.isIE = navigator.appName.indexOf('Internet Explorer') !== -1;

if (isIE) {

    //this force console to use log method for early loaded
    //modules that could use other console methods.
    console.group = function () {};
    console.groupEnd = function() {};
    console.debug = console.log;
    console.warning = console.log;
    console.error = console.log;
    console.tags = {
        add: function() {},
        remove: function () {}
    };

    console.settings = {
        save: function() {}
    };

}

define(['text!canopsis/enabled.json', 'app/lib/wrappers/console'], function(enabledPlugins) {
    enabledPlugins = JSON.parse(enabledPlugins);

    var deps = [
        'app/lib/objects/loader',
        'canopsis/file_loader',
        'seeds/RoutesLoader',
        'app/lib/wrappers/extend',
        'app/lib/utils/i18n',
        'link'
    ];

    for (var i = 0; i < enabledPlugins.length; i++) {
        var currentPlugin = enabledPlugins[i];

        deps.push('text!canopsis/'+ currentPlugin +'/files/routes.json');
        deps.push('text!canopsis/'+ currentPlugin +'/files/files.json');
        deps.push('text!canopsis/'+ currentPlugin +'/files/manifest.json');

        if(currentPlugin !== 'core')
        deps.push('canopsis/'+ currentPlugin +'/init');
    }

    require(deps, function() {
        require(['app/init'], function(Application) {
            Application.advanceReadiness();
        });
    });
});

