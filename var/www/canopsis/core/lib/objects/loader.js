/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
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

define([], function() {

    var loader = {
        loadComponents: function(components) {
            var deps = ['ember'];
            var depsSize = deps.length;
            var jsDeps = [];

            //generate deps
            for (var i = 0, l = components.length; i < l; i++) {
                deps.push('text!app/components/' + components[i] + '/template.html');

                var componentJsUrl = 'app/components/' + components[i] + '/component';
                jsDeps.push(componentJsUrl);
            }

            for (i = 0; i < jsDeps.length; i++) {
                deps.push(jsDeps[i]);
            }

            define(deps, function(Ember) {
                console.tags.add('loader');

                console.log("load components", arguments);
                for (var i = 0, l = components.length; i < l; i++) {

                    console.log('load component', components[i]);
                    var templateName = 'components/component-' + components[i];

                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i + depsSize]);
                }

                console.tags.remove('loader');
            });
        },

        loadWidgets: function(widgets) {
            var deps = ['ember'];
            var depsSize = deps.length;
            var jsDeps = [];


            //generate deps
            for (var i = 0, l = widgets.length; i < l; i++) {
                deps.push('text!' + widgets[i].url + '/template.html');

                var viewUrl = widgets[i].url + '/controller';
                console.log("adding view", viewUrl);

                jsDeps.push(viewUrl);
            }

            for (i = 0, l = jsDeps.length; i < l; i++) {
                deps.push(jsDeps[i]);
            }


            define(deps, function(Ember) {
                console.tags.add('loader');

                console.log({"load widgets": arguments});
                for (var i = 0, l = widgets.length; i < l; i++) {
                    var templateName = widgets[i].name;

                    var templateFileContent = arguments[i + depsSize];
                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(templateFileContent);
                }

                console.tags.remove('loader');
            });
        },

        loadEditors: function(editors) {
            var deps = ['ember', 'app/lib/editorregistry'];
            var depsSize = deps.length;
            var editorsDeps = [];

            //generate deps
            for (var i = 0, l = editors.length; i < l; i++) {
                var name = editors[i].name;
                var url = editors[i].url;

                var tmplPos;

                tmplPos = deps.push('text!' + url + '/template.html');
                editorsDeps.push({name: 'editor-' + name, pos: tmplPos});
            }

            define(deps, function(Ember, editorRegistry) {
                console.tags.add('loader');

                for (var i = 0; i < editorsDeps.length; i++) {
                    var tmplInfo = editorsDeps[i];

                    var template = arguments[tmplInfo.pos - 1];

                    console.log('new editor', tmplInfo.name);

                    editorRegistry.add({template: template}, tmplInfo.name);

                    Ember.TEMPLATES[tmplInfo.name] = Ember.Handlebars.compile(template);
                }

                console.groupEnd();

                console.tags.remove('loader');
            });
        },

        loadFactories: function(factories) {
            var factoriesDeps = ['app/application', 'app/lib/factoryregistry'];
            var factoriesDepsSize = factoriesDeps.length;

            for (var i = 0, l = factories.length; i < l; i++) {
                factoriesDeps.push(factories[i].url);
            }

            define(factoriesDeps, function(Application, factoryRegistry) {
                console.tags.add('loader');

                Application.factories = {};

                console.log('loading factories', factories, 'into', Application.factories);

                for (var i = 0, l = factories.length; i < l; i++) {
                    factoryRegistry.add({
                        name: factories[i].name.capitalize(),
                        factory: arguments[i + factoriesDepsSize]
                    });
                }

                console.tags.remove('loader');
                return Application.factories;
            });
        },

        loadForms: function(forms) {
            var deps = ['ember'];
            var jsDeps = [];
            var depsSize = deps.length;


            //generate deps
            for (var i = 0, l = forms.length; i < l; i++) {
                deps.push('text!app/forms/' + forms[i] + '/template.html');

                var controllerUrl = 'app/forms/' + forms[i] + '/controller';
                jsDeps.push(controllerUrl);
            }

            for (i = 0, l = jsDeps.length; i < l; i++) {
                deps.push(jsDeps[i]);
            }

            define(deps, function(Ember) {
                console.tags.add('loader');

                console.log("load forms", arguments);
                for (var i = 0, l = forms.length; i < l; i++) {
                    var templateName = forms[i];
                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i + depsSize]);
                }

                console.tags.remove('loader');

            });
        },

        loadHelpers: function(helpers) {
            var deps = ['app/application'];

            for (var i = 0, l = helpers.length; i < l; i++) {
                deps.push('app/lib/helpers/' + helpers[i]);
            }

            define(deps, function() {
                return helpers;
            });
        },

        loadMixins: function(mixins) {
            var deps = ['app/lib/mixinsregistry'];
            var depsSize = deps.length;

            for (var i = 0, l = mixins.length; i < l; i++) {
                var mixinUrl = 'app/mixins/' + mixins[i].name;
                deps.push(mixinUrl);
            }

            define(deps, function(mixinsregistry) {
                console.tags.add('loader');

                console.log('Begin load mixins', arguments);
                for (var i = depsSize, li = arguments.length; i < li; i++) {
                    var currentMixin = mixins[i - depsSize];

                    if (currentMixin.classes !== undefined) {
                        for (var j = 0, lj = currentMixin.classes.length; j < lj; j++) {
                            var currentClass = currentMixin.classes[j];

                            if (mixinsregistry.byClass[currentClass] === undefined) {
                                mixinsregistry.byClass[currentClass] = [];
                            }

                            mixinsregistry.byClass[currentClass].push(currentMixin.name);
                        }
                    }
                    mixinsregistry.all.push(currentMixin);
                }

                console.tags.remove('loader');

                return mixinsregistry;
            });
        },

        loadRenderers: function(renderers) {
            var rendererDeps = ['ember', 'app/lib/rendererregistry'];
            var rendererDepsSize = rendererDeps.length;

            for (var i = 0, l = renderers.length; i < l; i++) {
                rendererDeps.push('text!app/renderers/' + renderers[i] + '/template.html');
            }

            define(rendererDeps, function(Ember, rendererRegistry) {
                for (var i = rendererDepsSize, l = arguments.length; i < l; i++) {
                    var templateName = 'renderer-' + renderers[i - rendererDepsSize];

                    rendererRegistry.add({template: arguments[i]}, templateName);
                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i]);
                }
            });

        },

        loadTemplates: function() {
            var deps = ['ember'];
            var depsSize = deps.length;

            for (var i = 0; i < templates.length; i++) {
                deps.push('text!' + templates[i].url + '.html');
            }

            define(deps, function(Ember) {
                templatesLoaded = Ember.Object.create();
                templatesLoaded.all = [];
                templatesLoaded.byClass = Ember.Object.create();

                for (var i = depsSize, li = arguments.length; i < li; i++) {
                    var currentTemplate = templates[i - depsSize];
                    Ember.TEMPLATES[currentTemplate.name] = Ember.Handlebars.compile(arguments[i]);

                    currentTemplate.fileContent = arguments[i];

                    if (currentTemplate.classes !== undefined) {
                        for (var j = 0, lj = currentTemplate.classes.length; j < lj; j++) {
                            var currentClass = currentTemplate.classes[j];

                            if (templatesLoaded.byClass[currentClass] === undefined) {
                                templatesLoaded.byClass[currentClass] = [];
                            }

                            templatesLoaded.byClass[currentClass].push(currentTemplate);
                        }
                    }

                    templatesLoaded.all.push(currentTemplate);
                }

                return templatesLoaded;
            });

        }
    };

    window.loader = loader;

    return loader;
});
