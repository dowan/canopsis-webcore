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
    baseUrl: '/static/',
    paths: {
        'app': 'canopsis/core',

        'text': 'canopsis/core/lib/externals/requirejs-text/text',
        'link': 'canopsis/core/lib/externals/requirejs-link/link',

        'jquery': 'canopsis/core/lib/wrappers/jquery',
        'handlebars': 'canopsis/core/lib/externals/handlebars/handlebars',
        'ember-template-compiler': 'canopsis/core/lib/externals/min/ember-template-compiler',
        'ember': 'canopsis/core/lib/externals/min/ember',
        'ember-data': 'canopsis/core/lib/externals/min/ember-data'
    },
    shim: {
        'ember': {
            deps: ['jquery', 'ember-template-compiler', 'handlebars']
        },
        'ember-data': {
            deps: ['ember']
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

setModuleInfo = function (modules, showmodules) {
    if (showmodules) {
        var title = '<h5>Enabled modules :</h5>';
        $('#moduleList').append(title + modules.join('<br />'));
    }
};

define(['canopsis/enabled', 'canopsis/canopsisConfiguration', 'app/lib/utils/i18n', 'app/lib/objects/loader', 'jquery', 'ember', 'ember-data'], function(enabled, canopsisConfiguration, i18n) {

    var get = Ember.get;

    Ember.Object.reopen({
        toJson: function() {
            return JSON.parse(JSON.stringify(this));
        }
    });

    var controllerDict = {
        init: function() {
            if(get(this, 'isGenerated')) {
                console.error('Ember is Instantiating a generated controller. This practice is not encouraged, as it might also be an underlying requireJS problem.', this);
            }
            this._super.apply(this, arguments);
        }
    };

    Ember.Controller.reopen(controllerDict);
    Ember.ArrayController.reopen(controllerDict);
    Ember.ObjectController.reopen(controllerDict);
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
        deps.push('text!app/bower.json');

        if(window.environment) {
            deps.push('canopsis/environment.' + window.environment);
        } else {
            deps.push('canopsis/environment.production');
        }

        deps.push('app/lib/wrappers/extend');
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

                //This flag allow to prevent too early application requirement. @see "app/application" module
                window.appShouldNowBeLoaded = true;

                setLoadingInfo('Fetching application starting point', 'fa-plug');
                require(['app/application'], function(Application) {
                    setLoadingInfo('Initializing user interface', 'fa-desktop');

                });
            });
        });
    });
});
