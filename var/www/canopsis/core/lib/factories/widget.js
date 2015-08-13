/**
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
 *
 * @module canopsis-frontend-core
 */

define([
    'app/controller/widget',
    'app/lib/schemasregistry',
    'app/serializers/widget',
    'app/serializers/application',
    'app/mixins/embeddedrecordserializer',
    'app/lib/utils/notification',
    'app/lib/utils/data',
    'app/lib/loaders/schemas'
], function(WidgetController, schemasregistry, WidgetSerializer, ApplicationSerializer, EmbeddedRecordSerializerMixin, notificationUtils, dataUtils) {

    var widgetRegistrationsCallbacks = [];

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone,
        Application = dataUtils.getEmberApplicationSingleton();

    /**
     * Widget factory. Creates a controller, stores it in Application
     * @param widgetName {string} the name of the new widget. lowercase
     * @param classdict {dict} the controller dict
     * @param options {dict} options :
     *            - subclass: to handle widget's controller inheritance: default is WidgetController
     *            - templateName: to use another template in the editor
     *
     * @author Gwenael Pluchon <info@gwenp.fr>
     */
    function Widget(widgetName, classdict, options) {
        console.tags.add('factory');
        console.group("widget factory call", arguments);

        var extendArguments = [];

        if (options === undefined) {
            options = {};
        }

        //This option allows to manually define inheritance for widgets
        if (options.subclass === undefined) {
            options.subclass = WidgetController;
        }

        //TODO check if this is still needed, as mixins are in configuration now
        if (options.mixins !== undefined) {
            for (var i = 0, l = options.mixins.length; i < l; i++) {
                extendArguments.push(options.mixins[i]);
            }
        }

        extendArguments.push(classdict);

        var widgetControllerName = widgetName.dasherize();
        var widgetSerializerName = widgetName.dasherize();
        var widgetModel = schemasregistry.getByName(widgetName).EmberModel;
        var controllerClass = options.subclass.extend.apply(options.subclass, extendArguments);

        if(isNone(widgetModel)) {
            notificationUtils.error('No model found for the widget ' + widgetName + '. There might be no schema concerning this widget on the database');
        } else {
            console.log("extendArguments", extendArguments);
            console.log("subclass", options.subclass);

            var initializerName = widgetSerializerName.capitalize() + 'Controller';
            Ember.Application.initializer({
                name: initializerName,
                initialize: function(container, application) {
                    application.register('controller:' + widgetControllerName, controllerClass);
                }
            });

            //dynamically create a serializer that implements EmbeddedRecordMixin if a custom serializer is not already defined in Application
            var serializer = ApplicationSerializer.extend(
                EmbeddedRecordSerializerMixin,
                {}
            );

            initializerName = widgetSerializerName.capitalize() + 'Serializer';
            Ember.Application.initializer({
                name: initializerName,
                initialize: function(container, application) {
                    application.register('serializer:' + widgetSerializerName, WidgetSerializer.extend());
                }
            });

            console.log("widget", widgetName.camelize().capitalize(), widgetModel);
            var capitalizedWidgetName = widgetName.camelize().capitalize();
            var metadataDict = widgetModel.proto().metadata;

            console.log("metadataDict", widgetName, metadataDict);
            widgetRegistrationsCallbacks.pushObject(function(WidgetsRegistry) {
                var registryEntry = Ember.Object.create({
                    name: widgetName,
                    EmberClass: controllerClass
                });

                if(!isNone(metadataDict)) {
                    if(metadataDict.icon) {
                        registryEntry.set('icon', metadataDict.icon);
                    }
                    if(metadataDict.classes) {
                        var classes = metadataDict.classes;
                        for (var j = 0, lj = classes.length; j < lj; j++) {
                            var currentClass = classes[j];
                            if(!Ember.isArray(get( WidgetsRegistry.byClass, currentClass))) {
                                set(WidgetsRegistry.byClass, currentClass, Ember.A());
                            }

                            get(WidgetsRegistry.byClass, currentClass).push(registryEntry);
                        }
                    }
                }

                WidgetsRegistry.all.push(registryEntry);
            });
        }

        console.groupEnd();
        console.tags.remove('factory');

        return controllerClass;
    }

    Ember.Application.initializer({
        name: 'WidgetFactory',
        after: 'WidgetsRegistry',
        initialize: function(container, application) {
            var WidgetsRegistry = container.lookupFactory('registry:widgets');

            //FIXME temporary hack for initializers refactoring
            for (var i = 0; i < widgetRegistrationsCallbacks.length; i++) {
                widgetRegistrationsCallbacks[i](WidgetsRegistry);
            }

            application.register('factory:widget', Widget);
        }
    });

    return Widget;
});
