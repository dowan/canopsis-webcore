/*
# Copyright (c) 2015 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/

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
        'summernote': 'webcore-libs/summernote/dist/summernote',
        'ember-summernote': 'webcore-libs/ember-summernote/lib/component',
        'seeds': 'webcore-libs/seeds',
        'hashes': 'webcore-libs/jshashes/hashes',
        'handlebars': 'webcore-libs/handlebars/handlebars',
        'ember': 'canopsis/core/lib/wrappers/ember',
        'jsonselect': 'canopsis/core/lib/wrappers/jsonselect',
        'moment': 'webcore-libs/moment/min/moment-with-locales.min',
        'ember-data': 'canopsis/core/lib/wrappers/ember-data',
        'ember-listview': 'webcore-libs/ember-list-view/list-view',
        'daterangepicker': 'webcore-libs/bootstrap-daterangepicker/daterangepicker',
        'utils': 'canopsis/core/lib/loaders/utils',
        'math': 'webcore-libs/mathjs/dist/math',
        'dragtable': 'webcore-libs/dev/dragtable',
        'underscore' : 'canopsis/core/lib/wrappers/underscore',
        'ember-jsoneditor-lib': 'webcore-libs/ember-jsoneditor/build/lib',
        'lodash': 'webcore-libs/lodash/dist/lodash.compat',

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
        'flotchart-tooltip': 'webcore-libs/flot.tooltip/js/jquery.flot.tooltip',
        'flotchart-chartvalues': 'webcore-libs/flot-plugins/custom/jquery.flot.chartvalues',

        'circliful' : 'webcore-libs/circliful/js/jquery.circliful',

        'rrule': 'webcore-libs/kb-rrule/lib/rrule',
        'nlp': 'webcore-libs/kb-rrule/lib/nlp',

        'd3': 'webcore-libs/d3/d3'
    },

    shim: {
        'rrule': {
             deps: ['jquery', 'underscore']
        },

        'nlp': {
             deps: ['jquery', 'rrule', 'underscore']
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

        'flotchart-chartvalues': {
            deps: ['jquery', 'flotchart']
        },

        'circliful': {
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

var setLoadingInfo = function(text, icon) {
    if(window.__) {
        text = window.__(text, true);
    }

    $('#loadingInfo').html(text);

    if(icon) {
        $('#loading').append('<i class="fa '+ icon +'"></i>');
    }
};

define(['canopsis/enabled', 'plugins', 'canopsis/canopsisConfiguration', 'app/lib/objects/loader', 'jquery'], function(enabled, plugins_tools, canopsisConfiguration) {

    enabled.getEnabledModules(function (enabledPlugins) {

        setLoadingInfo('Fetching frontend plugin-ins', 'fa-cubes');
        var deps = [];

        for (var i = 0; i < enabledPlugins.length; i++) {
            var currentPlugin = enabledPlugins[i];

            if(currentPlugin !== 'core') {
                deps.push('text!canopsis/'+ currentPlugin +'/bower.json');
            }
        }
        deps.push('text!app/bower.json');

        if(canopsisConfiguration.DEBUG) {
            deps.push('canopsis/environment.debug');
        } else {
            deps.push('canopsis/environment.prod');
        }

        deps.push('app/lib/wrappers/extend');
        deps.push('app/lib/utils/i18n');
        deps.push('link');

        require(deps, function() {
            var initFiles = [];

            for (var i = 0, l = enabledPlugins.length; i < l; i++) {
                var currentPlugin = enabledPlugins[i];
                if(currentPlugin !== 'core') {
                    var brickManifest = JSON.parse(arguments[i]);

                    brickMainModule = 'canopsis/' + currentPlugin + '/' + brickManifest.main;
                    //remove the .js extension
                    brickMainModule = brickMainModule.slice(0, -3);

                    initFiles.push(brickMainModule);
                }
            }

            initFiles.push('app/init');

            require(initFiles, function() {

                setLoadingInfo('Fetching application starting point', 'fa-plug');
                require(['app/init'], function(Application) {
                    setLoadingInfo('Initializing user interface', 'fa-desktop');

                    Application.advanceReadiness();
                });
            });
        });
    });
});
