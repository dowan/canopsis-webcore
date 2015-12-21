/*
 * Copyright (c) 2015 "Capensis" [http://www.capensis.com]
 *
 * This file is part of Canopsis.
 *
 * Canopsis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Canopsis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
 */

require.config({
    waitSeconds: 30,
    baseUrl: '/static/',
    paths: {
        'text': 'canopsis/brick-loader/externals/requirejs-text/text',
        'link': 'canopsis/brick-loader/externals/requirejs-link/link',

        'jquery': 'canopsis/brick-loader/externals/jquery/dist/jquery',
        'handlebars': 'canopsis/brick-loader/externals/handlebars/handlebars',
        "ehbs" : 'canopsis/brick-loader/externals/requirejs-ember-handlebars/ehbs',
        'ember-template-compiler': 'canopsis/brick-loader/externals/ember-template-compiler',
        'ember-lib': 'canopsis/brick-loader/externals/ember.debug',
        'ember-data-lib': 'canopsis/brick-loader/externals/ember-data'
    },
    shim: {
        'ember-lib': {
            deps: ['jquery', 'ember-template-compiler', 'handlebars'],
            exports: 'Ember'
        },
        'ember-data-lib': {
            deps: ['ember-lib']
        }
    },
    ehbs : {
        ember : 'ember-lib'
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

setModuleInfo = function (modules, showmodules) {
    if (showmodules) {
        var title = '<h5>Enabled modules :</h5>';
        $('#moduleList').append(title + modules.join('<br />'));
    }
};

define(['canopsis/enabled',
        'canopsis/canopsisConfiguration',
        'canopsis/brick-loader/i18n',
        'canopsis/brick-loader/loader',
        'ember-data-lib'], function(enabled, canopsisConfiguration, i18n) {

    window.canopsisConfiguration = canopsisConfiguration;

    var get = Ember.get;

    canopsisConfiguration.EmberIsLoaded = true;


    DS.ArrayTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (Ember.typeOf(serialized) === 'array') {
                return serialized;
            }

            return [];
        },

        serialize: function(deserialized) {
            var type = Ember.typeOf(deserialized);

            if (type === 'array') {
                return deserialized;
            }
            else if (type === 'string') {
                return deserialized.split(',').map(function(item) {
                    return jQuery.trim(item);
                });
            }

            return [];
        }
    });

    DS.IntegerTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (typeof serialized === "number") {
                return serialized;
            } else {
                // console.warn("deserialized value is not a number as it is supposed to be", arguments);
                return 0;
            }
        },

        serialize: function(deserialized) {
            return Ember.isEmpty(deserialized) ? null : Number(deserialized);
        }
    });

    DS.ObjectTransform = DS.Transform.extend({
        deserialize: function(serialized) {
            if (Ember.typeOf(serialized) === 'object') {
                return Ember.Object.create(serialized);
            }

            return Ember.Object.create({});
        },

        serialize: function(deserialized) {
            var type = Ember.typeOf(deserialized);

            if (type === 'object' || type === 'instance') {
                return Ember.Object.create(deserialized);
            } else {
                console.warn("bad format", type, deserialized);
            }

            return null;
        }
    });

    enabled.getEnabledModules(function (enabledPlugins) {

        if (enabledPlugins.length === 0) {
            alert('No module loaded in Canopsis UI. Cannot go beyond');
        }

        setLoadingInfo('Fetching frontend bricks', 'fa-cubes');
        setModuleInfo(enabledPlugins, canopsisConfiguration.SHOWMODULES);
        var language = i18n.lang;
        console.log('i18n language:', language.toUpperCase(), 'translations:', i18n.translations);

        if(!language) {
            language = 'en';
        }

        var loc = Ember.String.loc;
        Ember.String.loc = function (fieldToTranslate) {
            i18n._(fieldToTranslate, true);
            return loc(fieldToTranslate);
        };

        Ember.STRINGS = i18n.translations[language] || {};

        var deps = [];

        for (var i = 0; i < enabledPlugins.length; i++) {
            var currentPlugin = enabledPlugins[i];

            if(currentPlugin !== 'core') {
                deps.push('text!canopsis/'+ currentPlugin +'/bower.json');
            }
        }
        deps.push('text!canopsis/core/bower.json');

        if(window.environment) {
            deps.push('canopsis/environment.' + window.environment);
        } else {
            deps.push('canopsis/environment.production');
        }

        deps.push('canopsis/brick-loader/extend');
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

            initFiles.push('canopsis/core/init');

            require(initFiles, function() {

                //This flag allow to prevent too early application requirement. @see "app/application" module
                window.appShouldNowBeLoaded = true;

                setLoadingInfo('Fetching application starting point', 'fa-plug');
                require(['canopsis/brick-loader/application'], function(Application) {
                    setLoadingInfo('Initializing user interface', 'fa-desktop');

                });
            });
        });
    });
});
